// src/components/sidebar/domain-menu.tsx
"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useDomain } from "@/hooks/use-domain";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import UploadButton from "@/components/upload-button"; // your custom upload logic
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  min?: boolean;
  domains:
    | { id: string; name: string; icon: string | null }[]
    | null
    | undefined;
};

const DomainMenu = ({ domains, min }: Props) => {
  const { register, onAddDomain, loading, errors, isDomain, setIcon } =
    useDomain();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex flex-col gap-3", min ? "mt-6" : "mt-3")}>
      {/* Header */}
      <div className="flex justify-between w-full items-center">
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

            <form onSubmit={onAddDomain} className="flex flex-col gap-4">
              <Input
                disabled={loading}
                {...register("name")}
                placeholder="Domain name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">
                  {errors.name.message as string}
                </p>
              )}

              <Input
                disabled={loading}
                {...register("url")}
                placeholder="https://yourdomain.com"
              />
              {errors.url && (
                <p className="text-sm text-red-500">
                  {errors.url.message as string}
                </p>
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setIcon(e.target.files?.[0] || null)}
                disabled={loading}
              />

              <Button disabled={loading} type="submit">
                {loading ? "Adding..." : "Add Domain"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Domain List */}
      <div className="flex flex-col gap-1">
        {domains?.length ? (
          domains.map((domain) => (
            <Link
              key={domain.id}
              href={`/dashboard/${domain.id}`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded hover:bg-muted transition text-sm",
                domain.id === isDomain && "bg-muted font-medium"
              )}
            >
              {domain.icon && (
                <Image
                  src={domain.icon}
                  alt={domain.name}
                  width={20}
                  height={20}
                  className="rounded"
                />
              )}
              {!min && <span>{domain.name}</span>}
            </Link>
          ))
        ) : (
          <p className="text-xs text-muted-foreground italic ml-2">
            No domains yet
          </p>
        )}
      </div>
    </div>
  );
};

export default DomainMenu;
