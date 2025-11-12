"use client";
import React, { useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

function DashboardNotifications() {
  const [notifications] = useState([
    {
      id: 1,
      type: "success",
      message: "Customer review received",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      message: "Product approved: Silk Blouse",
      time: "Yesterday",
    },
    {
      id: 3,
      type: "warning",
      message: "Low stock alert: Wool Coat",
      time: "2 days ago",
    },
    {
      id: 4,
      type: "info",
      message: "New payout processed",
      time: "3 days ago",
    },
  ]);

  // Only show first 3
  const displayed = notifications.slice(0, 3);

  // Icon rendering based on type
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "warning":
        return <FaExclamationCircle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 w-full md:w-[300px]">
      <h2 className="text-black font-semibold text-base mb-3">
        Notifications
      </h2>

      <div className="flex flex-col gap-3">
        {displayed.map((note) => (
          <div key={note.id} className="flex items-start gap-2">
            <div className="text-lg">{getIcon(note.type)}</div>
            <div>
              <p className="text-sm text-black">{note.message}</p>
              <p className="text-xs text-gray-500">{note.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-4 text-xs text-gray-600 hover:text-black font-medium underline"
      >
        View all notifications
      </button>
    </div>
  );
}

export default DashboardNotifications;
