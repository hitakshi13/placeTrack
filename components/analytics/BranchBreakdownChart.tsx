"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SalaryAnalytics } from "@/hooks/useAnalytics";

interface BranchBreakdownChartProps {
  data: SalaryAnalytics | undefined;
  isLoading: boolean;
}

export function BranchBreakdownChart({ data, isLoading }: BranchBreakdownChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average package by branch</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-56 w-full" />}

        {!isLoading && data && data.branchAverages.length > 0 && (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data.branchAverages}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                tickFormatter={(v: number) => `₹${v}L`}
              />
              <YAxis
                type="category"
                dataKey="branch"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [`₹${value.toFixed(1)} LPA`, "Avg package"]}
              />
              <Bar
                dataKey="averagePackage"
                fill="hsl(var(--success))"
                radius={[0, 4, 4, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {!isLoading && (!data || data.branchAverages.length === 0) && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No branch data available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
