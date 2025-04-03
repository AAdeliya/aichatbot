// src/hooks/use-domain.ts
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UploadClient } from "@uploadcare/upload-client";

// Define the schema for domain validation
const AddDomainSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  url: z.string().url("Must be a valid URL"),
});

// Initialize the upload client if the public key is available
const uploadClient = process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY
  ? new UploadClient({
      publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY,
    })
  : null;

export const useDomain = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(AddDomainSchema),
  });

  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDomain, setIsDomain] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState<File | null>(null);

  useEffect(() => {
    // Extract domain ID from the URL
    const pathParts = pathname.split("/");
    const potentialDomainId = pathParts[pathParts.length - 1];
    if (potentialDomainId && potentialDomainId !== "dashboard") {
      setIsDomain(potentialDomainId);
    }
  }, [pathname]);

  const onAddDomain = handleSubmit(async (values: FieldValues) => {
    if (!uploadClient) {
      toast.error("Upload client not initialized. Please check your configuration.");
      return;
    }

    setLoading(true);

    try {
      let iconUrl = null;

      // Upload the icon to Uploadcare if one was provided
      if (icon) {
        try {
          const result = await uploadClient.uploadFile(icon);
          iconUrl = result.cdnUrl;
        } catch (error) {
          console.error("Error uploading icon:", error);
          toast.error("Failed to upload icon");
          setLoading(false);
          return;
        }
      }

      // Call your server action to integrate the domain
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          icon: iconUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Domain added successfully");
        reset();
        setIcon(null);
        router.refresh();
      } else {
        toast.error(data.message || "Failed to add domain");
      }
    } catch (error) {
      console.error("Error adding domain:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  });

  return {
    register,
    onAddDomain,
    errors,
    loading,
    isDomain,
    setIcon,
  };
};