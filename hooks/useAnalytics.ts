"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_STALE_TIMES } from "@/lib/constants";

export const analyticsKeys = {
  salary: (filters: Record<string, unknown>) => ["analytics", "salary", filters] as const,
  placementStats: () => ["analytics", "placement-stats"] as const,
  funnel: (companyId?: string) => ["analytics", "funnel", companyId] as const,
};

export interface SalaryAnalytics {
  histogram: { range: string; count: number }[];
  companyAverages: { name: string; averagePackage: number; offerCount: number }[];
  branchAverages: { branch: string; averagePackage: number; offerCount: number }[];
  summary: {
    totalOffers: number;
    averagePackage: number;
    highestPackage: number;
    lowestPackage: number;
  };
}

export interface PlacementStats {
  totalStudents: number;
  totalPlaced: number;
  placementRate: number;
  averagePackage: number;
  highestPackage: number;
  companiesVisited: number;
  offersExtended: number;
}

export interface FunnelData {
  funnel: { stage: string; label: string; count: number }[];
  rejectedCount: number;
}

export function useSalaryAnalytics(filters: { branch?: string; gradYear?: string } = {}) {
  const params = new URLSearchParams();
  if (filters.branch) params.set("branch", filters.branch);
  if (filters.gradYear) params.set("gradYear", filters.gradYear);
  const qs = params.toString();

  return useQuery({
    queryKey: analyticsKeys.salary(filters),
    queryFn: () =>
      api.get<{ data: SalaryAnalytics }>(`/analytics/salary${qs ? `?${qs}` : ""}`),
    staleTime: QUERY_STALE_TIMES.LONG,
  });
}

export function usePlacementStats() {
  return useQuery({
    queryKey: analyticsKeys.placementStats(),
    queryFn: () => api.get<{ data: PlacementStats }>("/analytics/placement-stats"),
    staleTime: QUERY_STALE_TIMES.LONG,
  });
}

export function useFunnel(companyId?: string) {
  const qs = companyId ? `?companyId=${companyId}` : "";
  return useQuery({
    queryKey: analyticsKeys.funnel(companyId),
    queryFn: () => api.get<{ data: FunnelData }>(`/analytics/funnel${qs}`),
    staleTime: QUERY_STALE_TIMES.LONG,
  });
}
