"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, handleApiError } from "@/lib/api";
import { QUERY_STALE_TIMES } from "@/lib/constants";
import type { CreateAnnouncementInput } from "@/lib/validations/announcement";

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => api.get<{ data: unknown[] }>("/announcements"),
    staleTime: QUERY_STALE_TIMES.MEDIUM,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAnnouncementInput) =>
      api.post("/announcements", input),
    onSuccess: () => {
      toast.success("Announcement posted.");
      void queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (error) => handleApiError(error, "Failed to post announcement."),
  });
}
