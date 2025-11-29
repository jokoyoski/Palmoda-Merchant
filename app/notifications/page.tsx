"use client";
import React, { useEffect, useState } from "react";
import type { Notification as MyNotification } from "../_lib/type";
import { getNotifications, readNotification } from "../_lib/notifications";
import { toast } from "react-toastify";
import ProtectedRoute from "../_components/ProtectedRoute";

function page() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<MyNotification[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null); // track expanded notification

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await getNotifications();
        const notifs: MyNotification[] = res.data?.notifications || [];
        setNotifications(notifs);
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleMarkAsRead = async (id: string) => {
  try {
    const res = await readNotification(id);
    if (res.success === false) {
      toast.error(res.message || "Failed to mark as read");
      return;
    }

    // Remove the notification from state
    setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    setExpandedId(null); // collapse the details
    toast.success("Notification marked as read");
  } catch (error: any) {
    toast.error(error?.message || "Something went wrong");
  }
};

  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4 md:px-8 py-6 w-full">
        <h1 className="text-black font-semibold text-xl mb-4">
          Notifications ({notifications.length})
        </h1>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse h-12 bg-gray-200 rounded-md"
              ></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-xs">No notifications yet.</p>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className="bg-white border border-gray-200 rounded-md p-3 cursor-pointer"
              >
                {/* Notification Title */}
                <div
                  className="flex justify-between items-center"
                  onClick={() => handleToggle(notif._id)}
                >
                 <div>
                     <h1 className="text-sm font-semibold text-black">{notif.title}</h1>
                  <p className="text-xs text-gray-500">{notif.content}</p>
                  <p className="text-xs my-1 text-gray-500">Click to see more Details</p>
                 </div>
                  <span className="text-xs text-gray-500">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Expanded details */}
                {expandedId === notif._id && (
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    <p>{notif.content}</p>
                    {notif.details && (
                      <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                        <p>
                          <strong>Amount:</strong> NGN{notif.details.amount}
                        </p>
                        <p>
                          <strong>Status:</strong> {notif.details.status}
                        </p>
                        <p>
                          <strong>Reference:</strong> {notif.details.transaction_reference}
                        </p>
                        {notif.details.rejection_reason && (
                          <p>
                            <strong>Rejection Reason:</strong> {notif.details.rejection_reason}
                          </p>
                        )}
                      </div>
                    )}

                    <button
  onClick={() => handleMarkAsRead(notif._id)}
  className="mt-2 px-3 py-1 text-xs text-white bg-black rounded"
>
  Mark as Read
</button>

                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}

export default page;
