"use client";

import { Code2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useApplications } from "@/hooks/useApplications";
import { formatDate } from "@/lib/utils";

const RESULT_VARIANT: Record<string, "success" | "destructive" | "muted"> = {
  PASS: "success",
  FAIL: "destructive",
  PENDING: "muted",
};

export default function OATrackerPage() {
  const { data, isLoading } = useApplications({});
  const applications = data?.data ?? [];

  // Flatten all OA records across applications, paired with their company
  const oaEntries = applications.flatMap((app) =>
    app.oaRecords.map((oa) => ({ ...oa, company: app.company }))
  );

  return (
    <div>
      <PageHeader
        title="OA Tracker"
        description="All your online assessments in one place"
      />

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!isLoading && oaEntries.length === 0 && (
        <EmptyState
          icon={Code2}
          title="No OA records yet"
          description="OA records will appear here once you log a test for an application."
        />
      )}

      {!isLoading && oaEntries.length > 0 && (
        <div className="space-y-2">
          {oaEntries.map((oa) => (
            <Card key={oa.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{oa.company.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {oa.platform} · {formatDate(oa.testDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {oa.score !== null && oa.score !== undefined && (
                    <span className="text-sm font-medium text-foreground">
                      {oa.score}
                      {oa.totalScore ? `/${oa.totalScore}` : ""}
                    </span>
                  )}
                  <Badge variant={RESULT_VARIANT[oa.result] ?? "muted"}>{oa.result}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
