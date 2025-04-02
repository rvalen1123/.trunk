"use client";

import React from "react";
import { DashboardProvider } from "@/lib/dashboard/dashboard-context";
import CustomizableDashboard from "@/components/dashboard/customizable-dashboard";
import { Spinner } from "@heroui/react";

/**
 * Dashboard page component
 * Provides dashboard layout with widgets based on user role
 * 
 * @returns Dashboard page component
 */
export default function DashboardPage() {
  return (
    <DashboardProvider>
      <CustomizableDashboard />
    </DashboardProvider>
  );
}
