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
import { EmptyState } from "@/components/shared/EmptyState";
import { BarChart3 } from "lucide-react";
import type { SalaryAnalytics } from "@/hooks/useAnalytics";

interface SalaryHistogramProps {
  data: SalaryAnalytics | undefined;
  isLoading: boolean;
}

export function SalaryHistogram({ data, isLoading }: SalaryHistogramProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-56 w-full" />}

        {!isLoading && (!data || data.histogram.length === 0) && (
          <EmptyState
            icon={BarChart3}
            title="No offer data yet"
            description="Salary distribution will appear once students receive offers."
          />
        )}

        {!isLoading && data && data.histogram.length > 0 && (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.histogram} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                label={{
                  value: "Package (LPA)",
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [value, "Students"]}
                labelFormatter={(label) => `${label} LPA`}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
