"use client";

import React from "react";
import {
  HomeIcon,
  DocumentTextIcon,
  BeakerIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
}

export default function DashboardSidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Documents", href: "/dashboard/documents", icon: DocumentTextIcon },
    { name: "AI Assistants", href: "/dashboard/ai", icon: BeakerIcon },
    { name: "Sales & Commissions", href: "/dashboard/sales", icon: ChartBarIcon },
    { name: "Users & Facilities", href: "/dashboard/users", icon: UserGroupIcon },
    { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
  ];

  const sidebarBaseClasses = "h-screen border-r border-divider bg-background flex flex-col transition-width duration-300 ease-in-out";
  const sidebarWidth = collapsed ? "w-20" : "w-64";

  const linkBaseClasses = "flex items-center gap-3 p-3 rounded-md cursor-pointer text-foreground hover:bg-default-100";
  const linkActiveClasses = "bg-primary-100 text-primary-600 font-medium hover:bg-primary-100";
  const linkCollapsedClasses = "justify-center";

  const iconClasses = "h-5 w-5 flex-shrink-0";
  const textClasses = "truncate";

  return (
    <nav className={cn(sidebarBaseClasses, sidebarWidth)}>
      <div className={cn(
        "flex h-14 items-center border-b border-divider px-4 flex-shrink-0",
        collapsed ? "justify-center" : "justify-start"
      )}>
        <h1 className="text-xl font-bold text-primary-600">
          {collapsed ? "MSC" : "MSC Portal"}
        </h1>
      </div>
      <div className="flex flex-col gap-2 p-2 overflow-y-auto flex-grow">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href} passHref>
            <div
              className={cn(
                linkBaseClasses,
                pathname === item.href && linkActiveClasses,
                collapsed && linkCollapsedClasses
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={iconClasses} />
              {!collapsed && <span className={textClasses}>{item.name}</span>}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
