"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { FunnelData } from "@/hooks/useAnalytics";

interface PlacementFunnelProps {
  data: FunnelData | undefined;
  isLoading: boolean;
}

const STAGE_COLORS: Record<string, string> = {
  APPLIED: "bg-blue-500",
  OA: "bg-amber-500",
  INTERVIEW: "bg-purple-500",
  OFFER: "bg-green-500",
};

export function PlacementFunnel({ data, isLoading }: PlacementFunnelProps) {
  const maxCount = data?.funnel[0]?.count ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Placement funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}

        {!isLoading && data?.funnel.map((step) => {
          const pct = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
          return (
            <div key={step.stage} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{step.label}</span>
                <span className="text-muted-foreground">
                  {step.count} students
                  {step.stage !== "APPLIED" && maxCount > 0 && (
                    <span className="ml-1 text-muted-foreground">
                      ({Math.round(pct)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="h-7 w-full rounded-md bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-md transition-all duration-500",
                    STAGE_COLORS[step.stage] ?? "bg-primary"
                  )}
                  style={{ width: `${pct}%` }}
                  role="meter"
                  aria-valuenow={step.count}
                  aria-valuemax={maxCount}
                  aria-label={`${step.label}: ${step.count} students`}
                />
              </div>
            </div>
          );
        })}

        {!isLoading && data && data.rejectedCount > 0 && (
          <p className="text-xs text-muted-foreground pt-1">
            {data.rejectedCount} student{data.rejectedCount !== 1 ? "s" : ""} rejected across all stages.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
