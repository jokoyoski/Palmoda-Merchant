"use client";
import React, { useEffect, useState } from "react";
import type { Notification as MyNotification } from "../_lib/type";
import { getNotifications, readNotification, notificationCount } from "../_lib/notifications";
import { toast } from "react-toastify";
import ProtectedRoute from "../_components/ProtectedRoute";

function Page() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<MyNotification[]>([]);
  const [count, setCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch notifications when page changes
  const fetchNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getNotifications(page);

      const notifs: MyNotification[] = res?.data?.notifications || [];
      setNotifications(notifs);

      const totalItems = res?.data?.total_items || 0;
      const pageSize = res?.data?.page_size || 10;

      setTotalPages(Math.ceil(totalItems / pageSize));
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  // Fetch unread count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await notificationCount();
        setCount(res?.data?.count || 0);
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch count");
      }
    };
    fetchCount();
  }, []);

  const handleToggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleMarkAsRead = async (id: string) => {
  try {
    const res = await readNotification(id);
    if (res.success === false) {
      toast.error(res.message || "Failed to mark as read");
      return;
    }

    // Update the notification status locally
    setNotifications(prev =>
      prev.map(notif =>
        notif._id === id ? { ...notif, status: "read" } : notif
      )
    );

    // Collapse expanded details if open
    setExpandedId(null);

    // Refetch unread count
    const countRes = await notificationCount();
    setCount(countRes?.data?.count || 0);

    toast.success("Notification marked as read");
  } catch (error: any) {
    toast.error(error?.message || "Something went wrong");
  }
};


  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4 md:px-8 py-6 w-full">
        <h1 className="text-black font-semibold text-xl mb-4">
          Notifications ({count})
        </h1>

        {loading ? (
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
                    ${
                      notif.status === "unread"
                        ? "bg-yellow-50 border-0"
                        : "bg-white border border-gray-200"
                    }
                  `}
                >
                  <div className="flex justify-between items-center" onClick={() => handleToggle(notif._id)}>
                    <div>
                      <h1 className="text-sm font-semibold text-black">{notif.title}</h1>
                      <p className="text-xs text-gray-500">{notif.content}</p>
                      <p className="text-xs my-1 text-gray-500">Click to see details</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {expandedId === notif._id && (
                    <div className="mt-2 text-xs text-gray-600 space-y-1">
                      <p>{notif.content}</p>

                      {notif.details && (
                        <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                          <p><strong>Amount:</strong> NGN{notif.details.amount}</p>
                          <p><strong>Status:</strong> {notif.details.status}</p>
                          <p><strong>Reference:</strong> {notif.details.transaction_reference}</p>
                          {notif.details.rejection_reason && (
                            <p><strong>Rejection Reason:</strong> {notif.details.rejection_reason}</p>
                          )}
                        </div>
                      )}

                      {notif.status === "unread" && (
                        <button
                          onClick={() => handleMarkAsRead(notif._id)}
                          className="mt-2 px-3 py-1 cursor-pointer text-xs text-white bg-black rounded"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  )}
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
