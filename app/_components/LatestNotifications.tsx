"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Notification } from "../_lib/type";

type Variant = "dashboard" | "page";

interface LatestNotificationsProps {
  notifications: Notification[];
  loading: boolean;
  variant: Variant;
  limit?: number;
  showViewAllLink?: boolean;
  viewAllHref?: string;
  showMarkAsRead?: boolean;
  onMarkAsRead?: (id: string) => void;
}

export default function LatestNotifications({
  notifications,
  loading,
  variant,
  limit,
  showViewAllLink = false,
  viewAllHref = "/notifications",
  showMarkAsRead = false,
  onMarkAsRead,
}: LatestNotificationsProps) {
  const router = useRouter();

  const handleToggle = (notif: Notification) => {
    if (notif.type === "verification") {
      router.push("/kyc-compliance");
      return;
    }
    if (notif.type === "product" && notif.details?._id) {
      router.push(`/product/${notif.details._id}`);
      return;
    }
    if (notif.type === "message") {
      router.push("/messages");
      return;
    }
    if (notif.type === "order" && notif.details?._id) {
      router.push(`/orders/${notif.details._id}`);
      return;
    }
    if (notif.type === "payout") {
      router.push("/transactions");
      return;
    }
  };

  const items = (limit ? notifications.slice(0, limit) : notifications) || [];

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-12 bg-gray-200 rounded-md"></div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-gray-500 text-xs">No notifications yet.</p>;
  }

  return (
    <>
      <div className={variant === "page" ? "space-y-2" : ""}>
        {items.map((notif) => {
          if (variant === "page") {
            return (
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
                    {showMarkAsRead && notif.status === "unread" && onMarkAsRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notif._id);
                        }}
                        className="px-3 py-1 cursor-pointer text-xs text-black bg-white hover:bg-gray-100 rounded transition"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={notif._id}
              className="border-b border-gray-200 py-2 flex flex-col cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2"
              onClick={() => handleToggle(notif)}
            >
              <p className="text-sm font-semibold text-black">{notif.title}</p>
              <p className="text-xs text-gray-500">{notif.content}</p>
              <p className="text-[10px] text-gray-400 mt-1">
                {new Date(notif.created_at).toLocaleDateString()} {" "}
                {new Date(notif.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        })}
      </div>

      {showViewAllLink && (
        <Link href={viewAllHref} className="text-xs text-blue-500 underline">
          View All
        </Link>
      )}
    </>
  );
}
