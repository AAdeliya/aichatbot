"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { useUser } from "@clerk/nextjs";
import { DomainProvider } from "./domain-provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  // Check if the current path is an auth page
  const isAuthPage = pathname.startsWith("/auth");

  // If it's an auth page, don't render the sidebar or header
  if (isAuthPage) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      </ThemeProvider>
    );
  }

  // For non-auth pages, render the full layout with sidebar and header
  return (
    <ThemeProvider>
      <DomainProvider userId={user?.id || null}>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Header />
            <main className="flex-1 p-4 md:p-6 dark:text-gray-200">
              {children}
            </main>
          </div>
        </div>
      </DomainProvider>
    </ThemeProvider>
  );
}
