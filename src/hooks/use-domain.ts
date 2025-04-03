import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddDomainSchema } from "@/schema/settings.schema";
import { UploadClient } from "@uploadcare/upload-client";
import { onIntegrateDomain } from "@/actions/settings";
import { useToast } from "@/hooks/use-toast";

const upload = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
});

export const useDomain = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<{ name: string; url: string }>({
    resolver: zodResolver(AddDomainSchema),
  });

  const pathname = usePathname();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDomain, setIsDomain] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsDomain(pathname.split("/").pop());
  }, [pathname]);

  const onAddDomain = handleSubmit(async (values: FieldValues) => {
    setLoading(true);

    try {
      let iconUrl = null;

      // ✅ Upload to UploadCare if icon is present
      if (icon) {
        const { cdnUrl } = await upload.uploadFile(icon);
        iconUrl = cdnUrl;
      }

      // ✅ Call server action
      
      const response = await onIntegrateDomain(
        JSON.stringify({
          ...values,
          icon: iconUrl,
          domain: isDomain,
        }),
        iconUrl || "" // Ensure iconUrl is a string
      );

      toast({
        title: response.status === 200 ? "Success" : "Error",
        description: response.message,
      });

      if (response.status === 200) {
        reset();
        setIcon(null);
        router.refresh();
      }

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Something went wrong" });
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
    setIcon, // expose setter to update icon from input
  };
};
