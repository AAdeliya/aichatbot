// src/app/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { MenuGroup } from "@/components/ui/MenuGroup";
import { MenuItem } from "@/components/ui/MenuItem";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import {
  Home,
  Settings,
  Users,
  HelpCircle,
  Moon,
  Sun,
  Layers,
  BarChart,
  Calendar,
  MessageSquare,
} from "lucide-react";


// Theme toggle component using the context
const ThemeToggle: React.FC<{ expanded?: boolean }> = ({ expanded = true }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <MenuItem
    icon={theme === "light" ? Moon : Sun}
    label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    expanded={expanded}
    onClick={toggleTheme}
  />
  );
};

// Dashboard content component
const DashboardContent: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Total Users</h3>
          <p className="text-2xl font-bold">1,254</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900">
          <h3 className="font-medium text-green-800 dark:text-green-300 mb-1">Active Projects</h3>
          <p className="text-2xl font-bold">23</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900">
          <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-1">Messages</h3>
          <p className="text-2xl font-bold">18</p>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Recent Activity</h3>
        <ul className="space-y-2">
          <li className="flex items-center text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-gray-500 dark:text-gray-400 w-24">2 hrs ago</span>
            <span>New user registration</span>
          </li>
          <li className="flex items-center text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-gray-500 dark:text-gray-400 w-24">3 hrs ago</span>
            <span>Project status update</span>
          </li>
          <li className="flex items-center text-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
            <span className="text-gray-500 dark:text-gray-400 w-24">5 hrs ago</span>
            <span>New comment on task #54</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default function Dashboard() {
  // Track active menu item
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Sidebar>
          <MenuGroup title="Menu">
            <MenuItem
              icon={Home}
              label="Dashboard"
              isActive={activeItem === "dashboard"}
              onClick={() => setActiveItem("dashboard")}
            />
            <MenuItem
              icon={BarChart}
              label="Analytics"
              isActive={activeItem === "analytics"}
              onClick={() => setActiveItem("analytics")}
            />
            <MenuItem
              icon={Layers}
              label="Projects"
              isActive={activeItem === "projects"}
              onClick={() => setActiveItem("projects")}
            />
            <MenuItem
              icon={Calendar}
              label="Calendar"
              isActive={activeItem === "calendar"}
              onClick={() => setActiveItem("calendar")}
            />
            <MenuItem
              icon={MessageSquare}
              label="Messages"
              isActive={activeItem === "messages"}
              onClick={() => setActiveItem("messages")}
            />
            <MenuItem
              icon={Users}
              label="Team"
              isActive={activeItem === "team"}
              onClick={() => setActiveItem("team")}
            />
          </MenuGroup>

          <MenuGroup title="Options" collapsible defaultOpen={false}>
            <MenuItem
              icon={Settings}
              label="Settings"
              isActive={activeItem === "settings"}
              onClick={() => setActiveItem("settings")}
            />
            <MenuItem
              icon={HelpCircle}
              label="Help & Support"
              isActive={activeItem === "help"}
              onClick={() => setActiveItem("help")}
            />
            <ThemeToggle />
          </MenuGroup>
        </Sidebar>

        <div className="p-4 md:p-8 md:ml-64 transition-all duration-300">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          {activeItem === "dashboard" && <DashboardContent />}
          {activeItem !== "dashboard" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}</h2>
              <p className="text-gray-500 dark:text-gray-400">
                This is the {activeItem} page. Content for this section is coming soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}