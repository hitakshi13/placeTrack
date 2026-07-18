"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, handleApiError } from "@/lib/api";
import { QUERY_STALE_TIMES } from "@/lib/constants";
import { companyKeys } from "@/hooks/useCompanies";
import type { Application, ApiResponse } from "@/types";
import type { UpdateStageInput, CreateOAInput, CreateRoundInput } from "@/lib/validations/application";

export const applicationKeys = {
  all: ["applications"] as const,
list: (filters: ApplicationFilters) =>
  [...applicationKeys.all, "list", JSON.stringify(filters)] as const,};

export interface ApplicationFilters {
  stage?: "APPLIED" | "OA" | "INTERVIEW" | "OFFER" | "REJECTED" | "ALL";
  search?: string;
  sortBy?: "appliedAt" | "updatedAt" | "companyName";
  sortOrder?: "asc" | "desc";
}

function buildQueryString(filters: ApplicationFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

/** Fetches the current student's applications, optionally filtered by stage. */
export function useApplications(filters: ApplicationFilters = {}) {
  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: applicationKeys.list(filters),
    queryFn: () =>
      api.get<{ data: Application[] }>(`/applications${queryString ? `?${queryString}` : ""}`),
    staleTime: QUERY_STALE_TIMES.SHORT,
  });
}

/** Updates an application's pipeline stage. Used by both students and coordinators. */
export function useUpdateStage(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStageInput) =>
      api.patch<ApiResponse<Application>, UpdateStageInput>(
        `/applications/${applicationId}/stage`,
        input
      ),
    onSuccess: () => {
      toast.success("Application stage updated.");
      void queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      void queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
    onError: (error) => {
      handleApiError(error, "Failed to update application stage.");
    },
  });
}

/** Adds an OA record to an application. */
export function useAddOARecord(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOAInput) =>
      api.post<ApiResponse<unknown>, CreateOAInput>(
        `/applications/${applicationId}/oa`,
        input
      ),
    onSuccess: () => {
      toast.success("OA record added.");
      void queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
    onError: (error) => {
      handleApiError(error, "Failed to add OA record.");
    },
  });
}

/** Adds an interview round to an application. */
export function useAddInterviewRound(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRoundInput) =>
      api.post<ApiResponse<unknown>, CreateRoundInput>(
        `/applications/${applicationId}/rounds`,
        input
      ),
    onSuccess: () => {
      toast.success("Interview round added.");
      void queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
    onError: (error) => {
      handleApiError(error, "Failed to add interview round.");
    },
  });
}
