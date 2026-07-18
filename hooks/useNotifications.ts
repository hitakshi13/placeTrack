"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError } from "@/lib/api";
import { QUERY_STALE_TIMES } from "@/lib/constants";
import type { Notification } from "@/types";

export const notificationKeys = {
  all: ["notifications"] as const,
};

interface NotificationsResponse {
  data: Notification[];
  unreadCount: number;
}

/** Fetches the current user's notifications, polling every 30s for fresh deadline alerts. */
export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: () => api.get<NotificationsResponse>("/notifications"),
    staleTime: QUERY_STALE_TIMES.SHORT,
    refetchInterval: QUERY_STALE_TIMES.SHORT,
  });
}

/** Marks a single notification as read. */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => handleApiError(error, "Failed to mark notification as read."),
  });
}

/** Marks all notifications as read. */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.patch("/notifications", {}),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: (error) => handleApiError(error, "Failed to mark notifications as read."),
  });
}
