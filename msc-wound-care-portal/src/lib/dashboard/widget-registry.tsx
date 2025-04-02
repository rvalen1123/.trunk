import React from 'react';
import { DashboardWidget, UserRole } from '../types/dashboard';
import StatCard from '@/components/dashboard/stat-card';
import ChartCard from '@/components/dashboard/chart-card';
import DataTable from '@/components/dashboard/data-table';
import {
  DocumentTextIcon,
  BeakerIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// Mock data for widgets
const statCardData = [
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

/**
 * Registry of all available dashboard widgets
 */
const widgets: DashboardWidget[] = [
  {
    id: 'documents-stats',
    name: 'Documents Statistics',
    description: 'Shows document processing statistics',
    component: StatCard,
    defaultProps: statCardData[0],
    allowedRoles: ['Admin', 'Staff', 'Rep', 'Sub-rep'],
    defaultSize: 'small',
    defaultPosition: 0,
  },
  {
    id: 'ai-interactions',
    name: 'AI Interactions',
    description: 'Shows AI assistant usage statistics',
    component: StatCard,
    defaultProps: statCardData[1],
    allowedRoles: ['Admin', 'Staff'],
    defaultSize: 'small',
    defaultPosition: 1,
  },
  {
    id: 'sales-stats',
    name: 'Sales Statistics',
    description: 'Shows monthly revenue statistics',
    component: StatCard,
    defaultProps: statCardData[2],
    allowedRoles: ['Admin', 'Rep', 'Sub-rep'],
    defaultSize: 'small',
    defaultPosition: 2,
  },
  {
    id: 'user-stats',
    name: 'User Statistics',
    description: 'Shows active user statistics',
    component: StatCard,
    defaultProps: statCardData[3],
    allowedRoles: ['Admin'],
    defaultSize: 'small',
    defaultPosition: 3,
  },
  {
    id: 'monthly-sales-chart',
    name: 'Monthly Sales Chart',
    description: 'Line chart showing monthly sales data',
    component: ChartCard,
    defaultProps: {
      title: 'Monthly Sales',
      type: 'line',
      data: salesData,
    },
    allowedRoles: ['Admin', 'Rep'],
    defaultSize: 'large',
    defaultPosition: 4,
  },
  {
    id: 'product-categories-chart',
    name: 'Product Categories',
    description: 'Pie chart showing product category distribution',
    component: ChartCard,
    defaultProps: {
      title: 'Product Categories',
      type: 'pie',
      data: productData,
    },
    allowedRoles: ['Admin', 'Staff', 'Rep', 'Sub-rep'],
    defaultSize: 'medium',
    defaultPosition: 5,
  },
  {
    id: 'recent-documents',
    name: 'Recent Documents',
    description: 'Table showing recently processed documents',
    component: DataTable,
    defaultProps: {
      columns: documentColumns,
      data: recentDocuments,
      statusOptions: statusOptions,
    },
    allowedRoles: ['Admin', 'Staff', 'Rep', 'Sub-rep'],
    defaultSize: 'large',
    defaultPosition: 6,
  },
];

/**
 * Returns all available widgets
 */
export const getAllWidgets = (): DashboardWidget[] => {
  return widgets;
};

/**
 * Returns widgets available for a specific user role
 * 
 * @param role - User role
 */
export const getWidgetsForRole = (role: UserRole): DashboardWidget[] => {
  return widgets.filter(widget => widget.allowedRoles.includes(role));
};

/**
 * Returns a widget by ID
 * 
 * @param id - Widget ID
 */
export const getWidgetById = (id: string): DashboardWidget | undefined => {
  return widgets.find(widget => widget.id === id);
}; 