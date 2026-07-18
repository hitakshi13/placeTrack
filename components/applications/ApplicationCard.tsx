"use client";

import { Building2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatLPA, formatDate } from "@/lib/utils";
import type { Application } from "@/types";

interface ApplicationCardProps {
  application: Application;
  onClick?: () => void;
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:border-primary/30"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <CardContent className="p-3.5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {application.company.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {application.company.role}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {formatLPA(application.company.packageLpa)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatDate(application.appliedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
