// src/components/sidebar/domain-menu.tsx
"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Define the schema for domain validation
const AddDomainSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  url: z.string().url("Must be a valid URL"),
});

type AddDomainFormValues = z.infer<typeof AddDomainSchema>;

type Props = {
  min?: boolean;
  domains:
    | { id: string; name: string; icon: string | null }[]
    | null
    | undefined;
};

const DomainMenu = ({ domains, min }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDomainFormValues>({
    resolver: zodResolver(AddDomainSchema),
  });

  const onAddDomain = async (values: AddDomainFormValues) => {
    setLoading(true);

    try {
      // Here you would normally upload the icon and submit the form
      // For now we'll just simulate success
      console.log("Form values:", values);
      console.log("Icon:", icon);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Domain added successfully");
      setOpen(false);
      reset();
      setIcon(null);
    } catch (error) {
      console.error("Error adding domain:", error);
      toast.error("Failed to add domain");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", min ? "mt-6" : "mt-3")}>
      {/* Header */}
      <div className="flex justify-between w-full items-center px-3">
        {!min && <p className="text-xs text-gray-500">DOMAINS</p>}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <PlusCircle
              className="cursor-pointer text-gray-500 hover:text-primary"
              size={22}
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Domain</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onAddDomain)}
              className="flex flex-col gap-4"
            >
              <div>
                <Input
                  disabled={loading}
                  {...register("name")}
                  placeholder="Domain name"
                  className="mb-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Input
                  disabled={loading}
                  {...register("url")}
                  placeholder="https://yourdomain.com"
                  className="mb-1"
                />
                {errors.url && (
                  <p className="text-sm text-red-500">{errors.url.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setIcon(e.target.files?.[0] || null)
                  }
                  disabled={loading}
                  className="mb-1"
                />
                <p className="text-xs text-gray-500">Domain icon (optional)</p>
              </div>

              <Button disabled={loading} type="submit">
                {loading ? "Adding..." : "Add Domain"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Domain List */}
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {domains && domains.length > 0 ? (
          domains.map((domain) => (
            <Link
              key={domain.id}
              href={`/dashboard/${domain.id}`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm",
                "text-gray-800 dark:text-gray-300"
              )}
            >
              <div className="w-5 h-5 bg-orange-400 rounded-sm flex items-center justify-center text-white font-medium">
                {domain.icon ? (
                  <Image
                    src={domain.icon}
                    alt={domain.name}
                    width={20}
                    height={20}
                    className="rounded"
                  />
                ) : (
                  domain.name.charAt(0).toUpperCase()
                )}
              </div>
              {!min && <span>{domain.name}</span>}
            </Link>
          ))
        ) : (
          <p className="text-xs text-gray-500 italic px-3">No domains yet</p>
        )}
      </div>
    </div>
  );
};

export default DomainMenu;
