import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import type { Notification } from "../_lib/type";
import {
  getNotifications,
  notificationCount,
  readNotification,
} from "./notifications";

const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    total_items: number;
    page_size: number;
    total_pages: number;
  };
}

export interface NotificationCountResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}

export interface ReadNotificationResponse {
  success: boolean;
  message: string;
  data: Partial<Notification> | {};
}

export const useNotificationList = (pageNumber: number) => {
  const token = getToken();

  return useQuery<NotificationListResponse>({
    queryKey: ["notifications", pageNumber] as QueryKey,
    queryFn: () => getNotifications(pageNumber),
    enabled: !!token,
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: true,
    refetchInterval: false,
  });
};

export const useNotificationCount = () => {
  const token = getToken();

  return useQuery<NotificationCountResponse>({
    queryKey: ["notificationCount"] as QueryKey,
    queryFn: notificationCount,
    enabled: !!token,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    // If you want near-realtime badge updates, set this to e.g. 30_000 or 60_000.
    refetchInterval: 60 * 1000,
  });
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<ReadNotificationResponse, unknown, string>({
    mutationFn: readNotification,

    onSuccess: (_data, notificationId) => {
      // 1. Optimistically update the unread count
      queryClient.setQueryData<NotificationCountResponse>(
        ["notificationCount"],
        (oldCount) => {
          if (!oldCount || oldCount.data.count <= 0) return oldCount;
          return {
            ...oldCount,
            data: { count: oldCount.data.count - 1 },
          };
        }
      );

      // 2. Update ALL notification list pages in the cache
      // This fixes the issue - we update all paginated queries
      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: ["notifications"] },
        (oldData) => {
          if (!oldData || !oldData.data || !oldData.data.notifications) {
            return oldData;
          }

          const updatedNotifications = oldData.data.notifications.map(
            (notif) =>
              notif._id === notificationId
                ? { ...notif, status: "read" as const }
                : notif
          );

          return {
            ...oldData,
            data: {
              ...oldData.data,
              notifications: updatedNotifications,
            },
          };
        }
      );
    },

    onError: (error) => {
      console.error("Failed to mark notification as read:", error);

      // Rollback on error - refetch both count and notifications
      queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
