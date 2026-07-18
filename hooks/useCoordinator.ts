"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { QUERY_STALE_TIMES } from "@/lib/constants";

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  branch: string;
  cgpa: number;
  backlogs: number;
  graduationYear: number;
  rollNumber: string | null;
  applicationCount: number;
  isPlaced: boolean;
  bestOffer: { company: string; package: number } | null;
}

export function useStudents(filters: {
  branch?: string;
  placedOnly?: boolean;
  search?: string;
} = {}) {
  const params = new URLSearchParams();
  if (filters.branch) params.set("branch", filters.branch);
  if (filters.placedOnly) params.set("placedOnly", "true");
  if (filters.search) params.set("search", filters.search);
  const qs = params.toString();

  return useQuery({
    queryKey: ["coordinator", "students", filters],
    queryFn: () =>
      api.get<{ data: StudentRecord[] }>(`/coordinator/students${qs ? `?${qs}` : ""}`),
    staleTime: QUERY_STALE_TIMES.MEDIUM,
  });
}
