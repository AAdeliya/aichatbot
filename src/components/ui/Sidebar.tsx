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
import { getUserDomains } from "@/actions/settings";
import DomainMenu from "../sidebar/domain-menu";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

type Domain = {
  id: string;
  name: string;
  icon: string | null;
};

const defaultItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Conversations",
    href: "/dashboard/conversations",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: <Cable className="h-5 w-5" />,
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Email Marketing",
    href: "/dashboard/emailMarketing",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [domains, setDomains] = useState<Domain[] | null>(null);
  const pathname = usePathname();

  // Fetch domains on component mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const result = await getUserDomains();
        if (result.status === 200) {
          setDomains(result.domains);
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };

    fetchDomains();
  }, []);

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
            <div className="w-8 h-8 rounded-full bg-amber-400 mr-2 flex items-center justify-center">
              <span className="text-white font-semibold">M</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              MailGenie
            </h1>
          </Link>
        ) : (
          <div className="flex justify-center mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
              <span className="text-white font-semibold">M</span>
            </div>
          </div>
        )}
      </div>

      {/* Main navigation items */}
      <div className="space-y-6">
        <div className="py-2">
          <h2
            className={cn(
              "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3",
              isCollapsed && "sr-only"
            )}
          >
            Menu
          </h2>
          <div className="space-y-1">
            {defaultItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-gray-900 dark:text-gray-300 transition-all",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  pathname === item.href &&
                    "bg-gray-100 dark:bg-gray-800 font-medium text-primary dark:text-primary",
                  isCollapsed && "justify-center"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center",
                    pathname === item.href
                      ? "text-primary"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="ml-3 text-sm">{item.title}</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Domain section */}
        <DomainMenu domains={domains} collapsed={isCollapsed} />
      </div>

      {/* Sign out button */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Link
          href="/api/auth/sign-out"
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-gray-900 dark:text-gray-300",
            "transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
            isCollapsed && "justify-center"
          )}
        >
          <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
            <LogOut className="h-5 w-5" />
          </div>
          {!isCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
        </Link>
      </div>
    </div>
  );
}
