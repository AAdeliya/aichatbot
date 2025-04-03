"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { useDomain } from "@/hooks/use-domain";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Domain = {
  id: string;
  name: string;
  icon: string | null;
};

type DomainMenuProps = {
  collapsed?: boolean;
  domains?: Domain[] | null;
};

export default function DomainMenu({
  domains = [],
  collapsed = false,
}: DomainMenuProps) {
  const { register, onAddDomain, loading, errors, isDomain, setIcon } =
    useDomain();
  const [open, setOpen] = useState(false);

  return (
    <div className="px-3 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        {!collapsed && (
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Domains
          </h3>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <PlusCircle
                size={18}
                className="text-gray-500 hover:text-primary"
              />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
            </DialogHeader>
            <form onSubmit={onAddDomain} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Domain Name
                </label>
                <Input
                  id="name"
                  placeholder="My Website"
                  {...register("name")}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">
                    {errors.name.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  Domain URL
                </label>
                <Input
                  id="url"
                  placeholder="https://mywebsite.com"
                  {...register("url")}
                  disabled={loading}
                />
                {errors.url && (
                  <p className="text-sm text-red-500">
                    {errors.url.message?.toString()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="icon" className="text-sm font-medium">
                  Domain Icon
                </label>
                <Input
                  id="icon"
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setIcon(e.target.files?.[0] || null)
                  }
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Domain"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Domain List */}
      <div className="space-y-1 mt-2">
        {domains && domains.length > 0 ? (
          domains.map((domain) => (
            <Link
              key={domain.id}
              href={`/dashboard/${domain.id}`}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                "transition-colors duration-150 ease-in-out",
                domain.id === isDomain
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                collapsed && "justify-center"
              )}
            >
              {domain.icon ? (
                <Image
                  src={domain.icon}
                  alt={domain.name}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
              ) : (
                <div className="w-5 h-5 rounded-sm bg-primary/20 flex items-center justify-center">
                  <span className="text-xs text-primary">
                    {domain.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {!collapsed && <span className="ml-2">{domain.name}</span>}
            </Link>
          ))
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-2 px-3 italic">
            {collapsed ? "" : "No domains yet"}
          </div>
        )}
      </div>
    </div>
  );
}
