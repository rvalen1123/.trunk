"use client";

import React from "react";
import { Sidebar, SidebarItem } from "@nextui-org/sidebar";
import { 
  HomeIcon, 
  DocumentTextIcon, 
  BeakerIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  Cog6ToothIcon 
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <Sidebar 
      className="h-screen border-r border-divider bg-background"
      collapsed={collapsed}
    >
      <div className="flex h-14 items-center justify-center border-b border-divider">
        {!collapsed && (
          <h1 className="text-xl font-bold text-primary-600">MSC Portal</h1>
        )}
        {collapsed && (
          <h1 className="text-xl font-bold text-primary-600">MSC</h1>
        )}
      </div>
      <div className="flex flex-col gap-2 p-2">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <SidebarItem
              key={item.name}
              title={item.name}
              icon={<item.icon className="h-5 w-5" />}
              className={
                pathname === item.href
                  ? "bg-primary-100 text-primary-600 font-medium"
                  : ""
              }
            />
          </Link>
        ))}
      </div>
    </Sidebar>
  );
}
