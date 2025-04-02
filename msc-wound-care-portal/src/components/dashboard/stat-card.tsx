import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
          {icon}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-default-500">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex items-center justify-between">
          <p className="text-sm text-default-500">{description}</p>
          {trend && (
            <div
              className={`flex items-center text-sm ${
                trend.isPositive ? "text-success-500" : "text-danger-500"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
