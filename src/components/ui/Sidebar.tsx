// src/components/ui/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  children,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-collapse on mobile
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };

    // Check on initial render
    checkIfMobile();

    // Set up listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsVisible(!isVisible);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsVisible(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-full z-30
          transition-all duration-300 ease-in-out
          flex flex-col 
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          ${expanded ? "w-64" : "w-16"} 
          ${
            isMobile
              ? isVisible
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          ${className}
        `}
      >
        <div className="flex items-center justify-end p-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isMobile ? (
              <ChevronLeft size={20} />
            ) : expanded ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
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
      </aside>

      {/* Mobile toggle button - only visible when sidebar is hidden */}
      {isMobile && !isVisible && (
        <button
          className="fixed left-4 top-4 z-20 p-2 rounded-md bg-white dark:bg-gray-900 shadow-md"
          onClick={() => setIsVisible(true)}
          aria-label="Open sidebar"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Main content wrapper with padding based on sidebar state */}
      <main
        className={`
          transition-all duration-300 ease-in-out 
          ${!isMobile ? (expanded ? "ml-64" : "ml-16") : "ml-0"}
        `}
      >
        {/* Your main content goes here */}
      </main>
    </>
  );
};
