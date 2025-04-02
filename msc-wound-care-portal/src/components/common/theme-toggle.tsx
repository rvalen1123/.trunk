"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@heroui/react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

/**
 * Theme toggle component that switches between light and dark mode
 * 
 * @param props - Component props (optional className for styling)
 * @returns Theme toggle component
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";

  // Prevent hydration mismatch by only showing the toggle after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={className}>
      <Switch
        defaultSelected={isDark}
        size="sm"
        color="primary"
        startContent={<SunIcon className="h-4 w-4" />}
        endContent={<MoonIcon className="h-4 w-4" />}
        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
      />
    </div>
  );
} 