"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Building2, FileText, Trophy, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useApplications } from "@/hooks/useApplications";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuth } from "@/hooks/useAuth";
import { formatLPA, formatRelativeDate, isUrgent } from "@/lib/utils";

function ForbiddenToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "forbidden") {
      toast.error("You don't have permission to access that page.");
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return null;
}

function DashboardContent() {
  const { user } = useAuth();

  const { data: appsData, isLoading: appsLoading } = useApplications({});
  const { data: companiesData, isLoading: companiesLoading } = useCompanies({
    status: "OPEN",
    eligibleOnly: true,
    pageSize: 5,
    sortBy: "deadline",
    sortOrder: "asc",
  });

  const applications = appsData?.data ?? [];
  const upcomingDeadlines = companiesData?.data ?? [];

  const stats = {
    totalApplied: applications.length,
    inProgress: applications.filter((a) => ["OA", "INTERVIEW"].includes(a.stage)).length,
    offers: applications.filter((a) => a.stage === "OFFER").length,
    urgentDeadlines: upcomingDeadlines.filter((c) => isUrgent(c.deadline)).length,
  };

  return (
    <div>
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Here's where your placement journey stands today."
      />

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {appsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          : (
            <>
              <StatCard label="Applications" value={stats.totalApplied} icon={FileText} accentColor="primary" />
              <StatCard label="In progress" value={stats.inProgress} icon={Clock} accentColor="warning" />
              <StatCard label="Offers" value={stats.offers} icon={Trophy} accentColor="success" />
              <StatCard
                label="Urgent deadlines"
                value={stats.urgentDeadlines}
                icon={Building2}
                accentColor={stats.urgentDeadlines > 0 ? "destructive" : "info"}
              />
            </>
          )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Upcoming deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {companiesLoading && (
              <>
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </>
            )}
            {!companiesLoading && upcomingDeadlines.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No upcoming deadlines for eligible companies.
              </p>
            )}
            {!companiesLoading && upcomingDeadlines.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{formatLPA(company.packageLpa)}</p>
                </div>
                <Badge variant={isUrgent(company.deadline) ? "destructive" : "outline"}>
                  {formatRelativeDate(company.deadline)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {appsLoading && (
              <>
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </>
            )}
            {!appsLoading && applications.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">
                You haven&apos;t applied to any companies yet.
              </p>
            )}
            {!appsLoading && applications.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-md border border-border p-3 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{app.company.name}</p>
                  <p className="text-xs text-muted-foreground">{app.company.role}</p>
                </div>
                <Badge variant="outline">{app.stage}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ForbiddenToast />
      </Suspense>
      <DashboardContent />
    </>
  );
}