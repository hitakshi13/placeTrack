"use client";

import { useState } from "react";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { StageUpdateDialog } from "@/components/applications/StageUpdateDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { APPLICATION_STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Application } from "@/types";

interface ApplicationKanbanProps {
  applications: Application[];
  isLoading: boolean;
}

const STAGE_COLUMN_STYLES: Record<string, string> = {
  APPLIED: "border-t-blue-400",
  OA: "border-t-amber-400",
  INTERVIEW: "border-t-purple-400",
  OFFER: "border-t-green-400",
  REJECTED: "border-t-red-400",
};

export function ApplicationKanban({ applications, isLoading }: ApplicationKanbanProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {APPLICATION_STAGES.map((stage) => (
          <div key={stage.value} className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No applications yet"
        description="Browse companies and apply to start tracking your placement journey."
      />
    );
  }

  const grouped = APPLICATION_STAGES.reduce<Record<string, Application[]>>((acc, stage) => {
    acc[stage.value] = applications.filter((a) => a.stage === stage.value);
    return acc;
  }, {});

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {APPLICATION_STAGES.map((stage) => {
          const stageApps = grouped[stage.value] ?? [];
          return (
            <div key={stage.value} className="flex flex-col">
              <div
                className={cn(
                  "mb-3 flex items-center justify-between rounded-t-md border-t-2 bg-muted/40 px-3 py-2",
                  STAGE_COLUMN_STYLES[stage.value]
                )}
              >
                <span className="text-xs font-semibold text-foreground">{stage.label}</span>
                <span className="text-xs text-muted-foreground">{stageApps.length}</span>
              </div>
              <div className="flex-1 space-y-2">
                {stageApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onClick={() => setSelectedApp(app)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedApp && (
        <StageUpdateDialog
          application={selectedApp}
          open={!!selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </>
  );
}
