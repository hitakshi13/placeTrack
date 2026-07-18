"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, handleApiError } from "@/lib/api";
import { QUERY_STALE_TIMES } from "@/lib/constants";
import type { Company, PaginatedResponse, ApiResponse } from "@/types";
import type { CreateApplicationInput } from "@/lib/validations/application";

export const companyKeys = {
  all: ["companies"] as const,
list: (filters: CompanyFilters) =>
  [...companyKeys.all, "list", JSON.stringify(filters)] as const,  detail: (id: string) => [...companyKeys.all, "detail", id] as const,
};

export interface CompanyFilters {
  status?: "UPCOMING" | "OPEN" | "CLOSED";
  branch?: string;
  minPackage?: number;
  maxPackage?: number;
  eligibleOnly?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "deadline" | "packageLpa" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

function buildQueryString(filters: CompanyFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function useCompanies(filters: CompanyFilters = {}) {
  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: companyKeys.list(filters),
    queryFn: () =>
      api.get<PaginatedResponse<Company>>(`/companies${queryString ? `?${queryString}` : ""}`),
    staleTime: QUERY_STALE_TIMES.MEDIUM,
    placeholderData: (prev) => prev,
  });
}

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: companyKeys.detail(id ?? ""),
    queryFn: () => api.get<ApiResponse<Company>>(`/companies/${id}`),
    enabled: !!id,
    staleTime: QUERY_STALE_TIMES.MEDIUM,
  });
}

export function useApplyToCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateApplicationInput) =>
      api.post<ApiResponse<unknown>, CreateApplicationInput>("/applications", input),
    onSuccess: (data) => {
      toast.success((data as { message?: string }).message ?? "Application submitted!");
      void queryClient.invalidateQueries({ queryKey: companyKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error) => {
      handleApiError(error, "Failed to submit application.");
    },
  });
}
