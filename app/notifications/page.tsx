"use client";
import React, { useState } from "react";
import type { Notification } from "../_lib/type";
import { toast } from "react-toastify";
import ProtectedRoute from "../_components/ProtectedRoute";
import { useNotificationList, useNotificationCount, useReadNotification } from "../_lib/useNotifications";
import LatestNotifications from "../_components/LatestNotifications";

function Page() {
  const [currentPage, setCurrentPage] = useState(1);

  // React Query hooks
  const { data: listData, isLoading: loadingList } = useNotificationList(currentPage);
  const { data: countData } = useNotificationCount();
  const readMutation = useReadNotification();

  const notifications: Notification[] = listData?.data?.notifications || [];
  const pageSize = listData?.data?.page_size || 10;
  const totalItems = Math.max(listData?.data?.total_items || 0, notifications.length);
  const totalPages = Math.ceil(totalItems / pageSize);
  const count = countData?.data?.count || 0;

  const handleMarkAsRead = async (id: string) => {
    readMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Notification marked as read");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to mark notification as read");
      },
    });
  };

   console.log(notifications);
  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4 md:px-8 py-6 w-full">
        <h1 className="text-black font-semibold text-xl mb-4">
          Notifications ({count})
        </h1>

        <LatestNotifications
          notifications={notifications}
          loading={loadingList}
          variant="page"
          showMarkAsRead
          onMarkAsRead={handleMarkAsRead}
        />

        {!loadingList && notifications.length > 0 && (
          <div className="flex items-center justify-between gap-4 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-4 py-2 text-sm rounded border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-4 py-2 text-sm rounded border ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}

export default Page;
