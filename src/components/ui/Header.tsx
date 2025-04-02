// src/components/ui/Header.tsx
"use client";

import React from "react";
import { Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";

interface HeaderProps {
  sidebarOpen?: boolean;
  toggleSidebar?: () => void;
  className?: string;
}

export function Header({ sidebarOpen, toggleSidebar, className }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className={cn(
        "h-16 flex items-center justify-between px-4 border-b",
        "bg-white dark:bg-gray-900",
        "border-gray-200 dark:border-gray-800",
        className
      )}
    >
      <div className="flex items-center">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 mr-2 lg:hidden"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {/* Breadcrumb or page title could go here */}
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        {/* User profile avatar */}
        <div className="h-8 w-8 rounded bg-orange-400 flex items-center justify-center">
          {/* This is the orange square from the screenshot */}
        </div>
      </div>
    </header>
  );
}
