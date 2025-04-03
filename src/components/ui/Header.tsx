"use client";

import React from "react";
import { Menu, Moon, Sun, Bell } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "./button";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header
      className={cn(
        "h-16 flex items-center justify-between px-4 md:px-6 border-b",
        "bg-white dark:bg-gray-900",
        "border-gray-200 dark:border-gray-800",
        className
      )}
    >
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

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

        {/* User profile section */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-orange-400 flex items-center justify-center text-white">
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
