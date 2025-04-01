"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardNavbar from "@/components/dashboard/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden sm:block">
        <DashboardSidebar collapsed={sidebarCollapsed} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
