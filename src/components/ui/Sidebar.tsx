// src/components/ui/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Calendar,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cable,
} from "lucide-react";
import DomainMenu from "@/components/sidebar/domain-menu";
import { useUser } from "@clerk/nextjs";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant: "default" | "ghost";
};

const defaultItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "default",
  },
  {
    title: "Conversations",
    href: "/dashboard/conversations",
    icon: <MessageSquare className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: <Cable className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: <Calendar className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
  {
    title: "Email Marketing",
    href: "/dashboard/emailMarketing",
    icon: <Mail className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5 min-w-[20px] min-h-[20px]" />,
    variant: "ghost",
  },
];

interface SidebarProps {
  domains?: {
    id: string;
    name: string;
    icon: string | null;
  }[];
}

export function Sidebar({ domains }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [userDomains, setUserDomains] = useState<any[]>([]);

  // Fetch domains on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        // This is a placeholder - you would replace with actual API call
        // For now we'll use dummy data
        setUserDomains([
          { id: "1", name: "example.com", icon: null },
          { id: "2", name: "mysite.com", icon: null },
        ]);
      } catch (error) {
        console.error("Failed to fetch domains:", error);
      }
    };

    if (isSignedIn) {
      fetchDomains();
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative min-h-screen border-r px-4 pb-10 pt-8 transition-all duration-300",
        "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="absolute right-[-20px] top-7">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full border bg-white dark:bg-gray-800 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Logo or app name display */}
      <div className="mb-8">
        {!isCollapsed ? (
          <Link href="/dashboard" className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-400 mr-2"></div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              MailGenie
            </h1>
          </Link>
        ) : (
          <div className="flex justify-center mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-400"></div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="py-2">
          <h2
            className={cn(
              "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider",
              isCollapsed && "hidden"
            )}
          >
            MENU
          </h2>
          <div className="space-y-1 py-4">
            {defaultItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-gray-900 dark:text-gray-300 transition-all",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  pathname === item.href &&
                    "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white",
                  isCollapsed && "justify-center"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-5 h-5",
                    pathname === item.href
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {item.icon}
                </div>
                <span className={cn("ml-3 text-sm", isCollapsed && "hidden")}>
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Domain Menu */}
      <DomainMenu domains={userDomains} min={isCollapsed} />

      <div className="absolute bottom-4 left-4">
        <Link
          href="/auth/sign-in"
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-gray-900 dark:text-gray-300",
            "transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex items-center justify-center w-5 h-5 text-gray-500 dark:text-gray-400">
            <LogOut className="h-5 w-5 min-w-[20px] min-h-[20px]" />
          </div>
          <span className={cn("ml-3 text-sm", isCollapsed && "hidden")}>
            Sign Out
          </span>
        </Link>
      </div>
    </div>
  );
}
