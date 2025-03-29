// src/App.tsx
import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { Sidebar } from "./components/ui/Sidebar";
import { MenuGroup } from "./components/ui/MenuGroup";
import { MenuItem } from "./components/ui/MenuItem";
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

const App: React.FC = () => {
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
          <p>Your main content goes here</p>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
