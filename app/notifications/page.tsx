"use client";
import React, { useState } from "react";
import type { Notification } from "../_lib/type";
import { toast } from "react-toastify";
import ProtectedRoute from "../_components/ProtectedRoute";
import { useNotificationList, useNotificationCount, useReadNotification } from "../_lib/useNotifications";
import { useRouter } from "next/navigation";

function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // React Query hooks
  const { data: listData, isLoading: loadingList } = useNotificationList(currentPage);
  const { data: countData } = useNotificationCount();
  const readMutation = useReadNotification();

  const notifications: Notification[] = listData?.data?.notifications || [];
  const pageSize = listData?.data?.page_size || 10;
  const totalItems = Math.max(listData?.data?.total_items || 0, notifications.length);
  const totalPages = Math.ceil(totalItems / pageSize);
  const count = countData?.data?.count || 0;

  const handleToggle = (notif: Notification) => {
    // Redirect to KYC compliance page for verification notifications
    if (notif.type === "verification") {
      router.push("/kyc-compliance");
      return;
    }
    // Redirect to product details page for product notifications
    if (notif.type === "product" && notif.details?._id) {
      router.push(`/product/${notif.details._id}`);
      return;
    }
    // Redirect to messages page for message notifications
    if (notif.type === "message") {
      router.push("/messages");
      return;
    }
    // Redirect to order details page for order notifications
    if (notif.type === "order" && notif.details?._id) {
      router.push(`/orders/${notif.details._id}`);
      return;
    }
    // For payout type, redirect to transactions/wallet page
    if (notif.type === "payout") {
      router.push("/transactions");
      return;
    }
  };

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

        {loadingList ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse h-12 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-xs">No notifications yet.</p>
        ) : (
          <>
            {/* Notification List */}
            <div className="space-y-2">
              {notifications.map(notif => (
                <div
                  key={notif._id}
                  className={`rounded-md p-3 cursor-pointer transition
                    ${notif.status === "unread" ? "bg-gray-700 border-0" : "bg-white border border-gray-200"}
                  `}
                  onClick={() => handleToggle(notif)}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h1
                        className={`text-sm font-semibold ${notif.status === "unread" ? "text-white" : "text-black"}`}
                      >
                        {notif.title}
                      </h1>
                      <p
                        className={`text-xs ${notif.status === "unread" ? "text-white" : "text-gray-500"} line-clamp-2`}
                      >
                        {notif.content}
                      </p>
                      <p
                        className={`text-xs my-1 ${notif.status === "unread" ? "text-gray-300" : "text-gray-400"}`}
                      >
                        Click to see details
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-xs ${notif.status === "unread" ? "text-white" : "text-gray-500"}`}>
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                      {notif.status === "unread" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notif._id);
                          }}
                          className="px-3 py-1 cursor-pointer text-xs text-black bg-white hover:bg-gray-100 rounded transition"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-4 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
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
                onClick={() => setCurrentPage(p => p + 1)}
                className={`px-4 py-2 text-sm rounded border ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </ProtectedRoute>
  );
}

export default Page;
