// src/hooks/use-domain.ts
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DomainSchema } from "@/schema/domains/domains.schema";
import { UploadClient } from "@uploadcare/upload-client";
import { onIntegrateDomain } from "@/actions/settings";
import { toast } from "sonner";

const uploadClient = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || "demopublickey",
});

export const useDomain = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<{
    name: string;
    url: string;
    icon: string;
  }>({
    resolver: zodResolver(DomainSchema.omit({ id: true, userId: true, createdAt: true, updatedAt: true, stripeId: true })),
    defaultValues: {
      name: "",
      url: "",
      icon: ""
    }
  });

  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [isDomain, setIsDomain] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Extract domain ID from pathname if it exists
    const pathParts = pathname.split("/");
    if (pathParts.length > 2 && pathParts[1] === "dashboard") {
      setIsDomain(pathParts[2]);
    }
  }, [pathname]);

  const onAddDomain = handleSubmit(async (values) => {
    setLoading(true);

    try {
      let iconUrl = "";

      // Upload icon to UploadCare if provided
      if (icon) {
        try {
          const result = await uploadClient.uploadFile(icon);
          iconUrl = result.cdnUrl || "";
          console.log("Image uploaded:", iconUrl);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          toast.error("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Submit domain data to server action
      const domainData = {
        name: values.name,
        url: values.url,
        icon: iconUrl
      };

      const response = await onIntegrateDomain(domainData);

      if (response.status === 200) {
        toast.success(response.message);
        reset();
        setIcon(null);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error adding domain:", error);
      toast.error("Failed to add domain. Please try again.");
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