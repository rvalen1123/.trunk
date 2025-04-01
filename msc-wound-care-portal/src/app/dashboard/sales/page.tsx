"use client";

import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tabs,
  Tab,
  Grid,
} from "@nextui-org/react";
import StatCard from "@/components/dashboard/stat-card";
import ChartCard from "@/components/dashboard/chart-card";
import CommissionTable from "@/components/dashboard/commission-table";
import {
  ChartBarIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function SalesPage() {
  // Mock data for stats
  const stats = [
    {
      title: "Total Sales",
      value: "$124,500",
      icon: <ChartBarIcon className="h-5 w-5" />,
      description: "Current quarter",
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Commissions",
      value: "$32,450",
      icon: <BanknotesIcon className="h-5 w-5" />,
      description: "Current quarter",
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Facilities",
      value: 28,
      icon: <BuildingStorefrontIcon className="h-5 w-5" />,
      description: "Active accounts",
      trend: { value: 5, isPositive: true },
    },
    {
      title: "Sales Reps",
      value: 12,
      icon: <UserGroupIcon className="h-5 w-5" />,
      description: "Active reps",
      trend: { value: 2, isPositive: true },
    },
  ];

  // Mock data for charts
  const monthlySalesData = [
    { name: "Jan", value: 42000 },
    { name: "Feb", value: 39000 },
    { name: "Mar", value: 45000 },
    { name: "Apr", value: 52000 },
    { name: "May", value: 48000 },
    { name: "Jun", value: 54500 },
  ];

  const productCategoryData = [
    { name: "Wound Dressings", value: 35 },
    { name: "Compression", value: 25 },
    { name: "Negative Pressure", value: 20 },
    { name: "Skin Care", value: 15 },
    { name: "Other", value: 5 },
  ];

  const topFacilitiesData = [
    { name: "Memorial Hospital", value: 28500 },
    { name: "City Medical Center", value: 22000 },
    { name: "County Wound Care", value: 18500 },
    { name: "Veterans Clinic", value: 15000 },
    { name: "University Hospital", value: 12500 },
  ];

  // Mock data for commissions
  const commissions = [
    {
      id: "1",
      rep: {
        name: "John Smith",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "john.smith@example.com",
      },
      facility: "Memorial Hospital",
      amount: 1250.75,
      status: "Paid",
      date: "2025-03-15",
      orderNumber: "ORD-2025-001",
    },
    {
      id: "2",
      rep: {
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
        email: "sarah.johnson@example.com",
      },
      facility: "City Medical Center",
      amount: 875.50,
      status: "Pending",
      date: "2025-03-18",
      orderNumber: "ORD-2025-002",
    },
    {
      id: "3",
      rep: {
        name: "Robert Williams",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
        email: "robert.williams@example.com",
      },
      facility: "County Wound Care",
      amount: 1050.25,
      status: "Processing",
      date: "2025-03-20",
      orderNumber: "ORD-2025-003",
    },
    {
      id: "4",
      rep: {
        name: "Jennifer Davis",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g",
        email: "jennifer.davis@example.com",
      },
      facility: "Veterans Clinic",
      amount: 750.00,
      status: "Paid",
      date: "2025-03-22",
      orderNumber: "ORD-2025-004",
    },
    {
      id: "5",
      rep: {
        name: "Michael Brown",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704h",
        email: "michael.brown@example.com",
      },
      facility: "University Hospital",
      amount: 925.75,
      status: "Rejected",
      date: "2025-03-25",
      orderNumber: "ORD-2025-005",
    },
    {
      id: "6",
      rep: {
        name: "Lisa Miller",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704i",
        email: "lisa.miller@example.com",
      },
      facility: "Memorial Hospital",
      amount: 1100.50,
      status: "Pending",
      date: "2025-03-28",
      orderNumber: "ORD-2025-006",
    },
    {
      id: "7",
      rep: {
        name: "David Wilson",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704j",
        email: "david.wilson@example.com",
      },
      facility: "City Medical Center",
      amount: 825.25,
      status: "Processing",
      date: "2025-03-30",
      orderNumber: "ORD-2025-007",
    },
  ];

  const handleCommissionAction = (action: string, commission: any) => {
    console.log(`Action: ${action}`, commission);
    // Implement actual actions here
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sales & Commissions</h1>

      <Grid.Container gap={2}>
        {stats.map((stat, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid.Container>

      <Tabs aria-label="Sales Data" color="primary">
        <Tab key="overview" title="Overview">
          <div className="mt-4 space-y-6">
            <Grid.Container gap={2}>
              <Grid xs={12} md={8}>
                <ChartCard
                  title="Monthly Sales"
                  type="line"
                  data={monthlySalesData}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <ChartCard
                  title="Product Categories"
                  type="pie"
                  data={productCategoryData}
                />
              </Grid>
            </Grid.Container>

            <Grid.Container gap={2}>
              <Grid xs={12} md={6}>
                <ChartCard
                  title="Top Facilities"
                  type="bar"
                  data={topFacilitiesData}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Recent Commissions</h3>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <CommissionTable
                      commissions={commissions.slice(0, 3)}
                      onAction={handleCommissionAction}
                    />
                  </CardBody>
                </Card>
              </Grid>
            </Grid.Container>
          </div>
        </Tab>
        <Tab key="commissions" title="Commissions">
          <div className="mt-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Commission Management</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <CommissionTable
                  commissions={commissions}
                  onAction={handleCommissionAction}
                />
              </CardBody>
            </Card>
          </div>
        </Tab>
        <Tab key="reports" title="Reports">
          <div className="mt-4">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Sales Reports</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-default-500">
                  This section will contain downloadable reports and analytics.
                </p>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
