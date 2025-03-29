// src/components/ui/MenuItem.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  expanded = true,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center px-3 py-2 rounded-md mb-1
        transition-all duration-200 ease-in-out
        font-medium text-sm
        ${
          isActive
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
        ${expanded ? "justify-start" : "justify-center"}
        ${className}
      `}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        size={20}
        className={`${
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400"
        }`}
      />

      {expanded && (
        <span className="ml-3 whitespace-nowrap overflow-hidden transition-all duration-200">
          {label}
        </span>
      )}
    </button>
  );
};
