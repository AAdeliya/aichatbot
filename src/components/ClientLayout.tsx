// src/components/ClientLayout.tsx
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 dark:text-gray-200">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
