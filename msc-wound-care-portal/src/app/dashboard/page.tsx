"use client";

import React from "react";
import { Grid, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import StatCard from "@/components/dashboard/stat-card";
import ChartCard from "@/components/dashboard/chart-card";
import DataTable from "@/components/dashboard/data-table";
import {
  DocumentTextIcon,
  BeakerIcon,
  ChartBarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  // Mock data for stats
  const stats = [
    {
      title: "Documents",
      value: 128,
      icon: <DocumentTextIcon className="h-5 w-5" />,
      description: "Total documents processed",
      trend: { value: 12, isPositive: true },
    },
    {
      title: "AI Interactions",
      value: 432,
      icon: <BeakerIcon className="h-5 w-5" />,
      description: "AI assistant usage",
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Sales",
      value: "$24,500",
      icon: <ChartBarIcon className="h-5 w-5" />,
      description: "Monthly revenue",
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Users",
      value: 42,
      icon: <UserGroupIcon className="h-5 w-5" />,
      description: "Active users",
      trend: { value: 2, isPositive: false },
    },
  ];

  // Mock data for charts
  const salesData = [
    { name: "Jan", value: 12000 },
    { name: "Feb", value: 19000 },
    { name: "Mar", value: 15000 },
    { name: "Apr", value: 22000 },
    { name: "May", value: 18000 },
    { name: "Jun", value: 24500 },
  ];

  const productData = [
    { name: "Wound Dressings", value: 35 },
    { name: "Compression", value: 25 },
    { name: "Negative Pressure", value: 20 },
    { name: "Skin Care", value: 15 },
    { name: "Other", value: 5 },
  ];

  // Mock data for recent documents
  const recentDocuments = [
    {
      id: 1,
      name: "Prior Authorization - John Smith",
      type: "Prior Auth",
      status: "Completed",
      date: "2025-03-28",
    },
    {
      id: 2,
      name: "BAA Agreement - Memorial Hospital",
      type: "Agreement",
      status: "Pending",
      date: "2025-03-29",
    },
    {
      id: 3,
      name: "Order Form - Jane Doe",
      type: "Order",
      status: "Processing",
      date: "2025-03-30",
    },
    {
      id: 4,
      name: "Commission Report - Q1 2025",
      type: "Report",
      status: "Completed",
      date: "2025-03-31",
    },
    {
      id: 5,
      name: "Product Recommendation - Robert Johnson",
      type: "AI Report",
      status: "Completed",
      date: "2025-04-01",
    },
  ];

  const documentColumns = [
    { key: "name", label: "NAME" },
    { key: "type", label: "TYPE" },
    { key: "status", label: "STATUS", sortable: true },
    { key: "date", label: "DATE", sortable: true },
    { key: "actions", label: "ACTIONS" },
  ];

  const statusOptions = {
    completed: { color: "success" },
    pending: { color: "warning" },
    processing: { color: "primary" },
  };

  const handleRowAction = (action: "view" | "edit" | "delete", item: any) => {
    console.log(action, item);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Grid.Container gap={2}>
        {stats.map((stat, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid.Container>

      <Grid.Container gap={2}>
        <Grid xs={12} md={8}>
          <ChartCard title="Monthly Sales" type="line" data={salesData} />
        </Grid>
        <Grid xs={12} md={4}>
          <ChartCard title="Product Categories" type="pie" data={productData} />
        </Grid>
      </Grid.Container>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Documents</h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <DataTable
            columns={documentColumns}
            data={recentDocuments}
            statusOptions={statusOptions}
            onRowAction={handleRowAction}
          />
        </CardBody>
      </Card>
    </div>
  );
}
