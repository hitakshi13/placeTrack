"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ApplicationKanban } from "@/components/applications/ApplicationKanban";
import { Badge } from "@/components/ui/badge";
import { useApplications, type ApplicationFilters } from "@/hooks/useApplications";

export default function ApplicationsPage() {
  const [filters] = useState<ApplicationFilters>({ stage: "ALL" });
  const { data, isLoading } = useApplications(filters);

  const applications = data?.data ?? [];
  const activeCount = applications.filter((a) => a.stage !== "REJECTED").length;
  const offerCount = applications.filter((a) => a.stage === "OFFER").length;

  return (
    <div>
      <PageHeader
        title="My Applications"
        description="Track every application from submission to offer"
        actions={
          !isLoading && applications.length > 0 ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{activeCount} active</Badge>
              {offerCount > 0 && <Badge variant="success">{offerCount} offers</Badge>}
            </div>
          ) : undefined
        }
      />

      <ApplicationKanban applications={applications} isLoading={isLoading} />
    </div>
  );
}
