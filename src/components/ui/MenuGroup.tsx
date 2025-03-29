// src/components/ui/MenuGroup.tsx
import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface MenuGroupProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({
  title,
  children,
  expanded = true,
  collapsible = false,
  defaultOpen = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleGroup = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      {/* Only show title when sidebar is expanded */}
      {expanded && (
        <div
          className={`
            flex items-center mb-2 px-3 
            ${
              collapsible
                ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                : ""
            }
          `}
          onClick={toggleGroup}
        >
          {collapsible && (
            <span className="mr-1 text-gray-400">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          <span className="uppercase text-xs font-bold text-gray-500 dark:text-gray-400">
            {title}
          </span>
        </div>
      )}

      {/* Children (menu items) */}
      <div className={`${collapsible && !isOpen ? "hidden" : "block"}`}>
        {/* Pass down expanded state to children */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              expanded,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};
