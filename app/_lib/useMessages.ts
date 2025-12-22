import { useQuery, useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import type { MessageType } from "../_lib/type";
import {
  getMessages,
  messageCount,
  readMessage,
} from "./messages";

export interface MessageListResponse {
  success: boolean;
  message: string;
  data: MessageType[];
}

export interface MessageCountResponse {
  success: boolean;
  message: string;
  data: {
    unread_count: number; // ✅ Changed from 'count' to 'unread_count'
  };
}

export interface ReadMessageResponse {
  success: boolean;
  message: string;
  data: Partial<MessageType> | {};
}

export const useMessageList = () => {
  return useQuery<MessageListResponse>({
    queryKey: ["messages"] as QueryKey,
    queryFn: getMessages,
    staleTime: 1 * 60 * 1000,
     // cache is fresh for 5 minutes
      refetchOnWindowFocus: false,
     refetchInterval: 1000,
  });
};

export const useMessageCount = () => {
  return useQuery<MessageCountResponse>({
    queryKey: ["messageCount"] as QueryKey,
    queryFn: messageCount,
    staleTime: 60 * 1000, // cache is fresh for 1 min
    refetchOnWindowFocus: false,
    refetchInterval: 1000, // refetch every minute
  });
};

export const useReadMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<ReadMessageResponse, unknown, string>({
    mutationFn: readMessage,

    onSuccess: (_data, messageId) => {
      // 1. Optimistically update the unread count
      queryClient.setQueryData<MessageCountResponse>(
        ["messageCount"],
        (oldCount) => {
          if (!oldCount || oldCount.data.unread_count <= 0) return oldCount; // ✅ Changed
          return {
            ...oldCount,
            data: { unread_count: oldCount.data.unread_count - 1 }, // ✅ Changed
          };
        }
      );

      // 2. Update the message list in the cache
      queryClient.setQueryData<MessageListResponse>(
        ["messages"],
        (oldData) => {
          if (!oldData || !oldData.data) {
            return oldData;
          }

          const updatedMessages = oldData.data.map((msg) =>
            msg._id === messageId
              ? { ...msg, is_read: true }
              : msg
          );

          return {
            ...oldData,
            data: updatedMessages,
          };
        }
      );
    },

    onError: (error) => {
      console.error("Failed to mark message as read:", error);

      // Rollback on error - refetch both count and messages
      queryClient.invalidateQueries({ queryKey: ["messageCount"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};