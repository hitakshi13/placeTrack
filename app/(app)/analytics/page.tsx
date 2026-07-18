"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { SalaryHistogram } from "@/components/analytics/SalaryHistogram";
import { PlacementFunnel } from "@/components/analytics/PlacementFunnel";
import { BranchBreakdownChart } from "@/components/analytics/BranchBreakdownChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, TrendingUp, Building2, Users } from "lucide-react";
import { useSalaryAnalytics, useFunnel, usePlacementStats } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
import { formatLPA } from "@/lib/utils";

export default function AnalyticsPage() {
  const { isCoordinator, isAdmin } = useAuth();
  const showStats = isCoordinator || isAdmin;

  const { data: salaryData, isLoading: salaryLoading } = useSalaryAnalytics();
  const { data: funnelData, isLoading: funnelLoading } = useFunnel();
  const { data: statsData, isLoading: statsLoading } = usePlacementStats();

  const salary = salaryData?.data;
  const funnel = funnelData?.data;
  const stats = statsData?.data;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Placement statistics and salary insights for your campus"
      />

      {/* Coordinator-only stat cards */}
      {showStats && (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))
            : stats && (
                <>
                  <StatCard
                    label="Total students"
                    value={stats.totalStudents}
                    icon={Users}
                    accentColor="primary"
                  />
                  <StatCard
                    label="Students placed"
                    value={stats.totalPlaced}
                    icon={Trophy}
                    accentColor="success"
                    trend={{
                      value: `${stats.placementRate}% placement rate`,
                      positive: stats.placementRate >= 50,
                    }}
                  />
                  <StatCard
                    label="Avg package"
                    value={formatLPA(stats.averagePackage)}
                    icon={TrendingUp}
                    accentColor="info"
                  />
                  <StatCard
                    label="Companies visited"
                    value={stats.companiesVisited}
                    icon={Building2}
                    accentColor="warning"
                  />
                </>
              )}
        </div>
      )}

      {/* Summary row — available to all */}
      {!showStats && salary?.summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total offers"
            value={salary.summary.totalOffers}
            icon={Trophy}
            accentColor="success"
          />
          <StatCard
            label="Avg package"
            value={formatLPA(salary.summary.averagePackage)}
            icon={TrendingUp}
            accentColor="primary"
          />
          <StatCard
            label="Highest package"
            value={formatLPA(salary.summary.highestPackage)}
            icon={TrendingUp}
            accentColor="info"
          />
          <StatCard
            label="Lowest package"
            value={formatLPA(salary.summary.lowestPackage)}
            icon={TrendingUp}
            accentColor="warning"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SalaryHistogram data={salary} isLoading={salaryLoading} />
        <PlacementFunnel data={funnel} isLoading={funnelLoading} />
        <div className="lg:col-span-2">
          <BranchBreakdownChart data={salary} isLoading={salaryLoading} />
        </div>
      </div>
    </div>
  );
}
