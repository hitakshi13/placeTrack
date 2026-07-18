import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accentColor?: "primary" | "success" | "warning" | "info" | "destructive";
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps["accentColor"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accentColor = "primary",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1.5 text-2xl font-semibold text-foreground">{value}</p>
            {trend && (
              <p
                className={cn(
                  "mt-1 text-xs font-medium",
                  trend.positive ? "text-success" : "text-destructive"
                )}
              >
                {trend.value}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              ACCENT_CLASSES[accentColor]
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
