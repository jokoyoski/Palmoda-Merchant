"use client";
import React from "react";

function RecentOrders() {
  const orders = [
    {
      id: "#78291",
      date: "May 12, 2023",
      total: 258.99,
      items: 2,
      status: "Shipped",
    },
    {
      id: "#78290",
      date: "May 11, 2023",
      total: 129.99,
      items: 1,
      status: "Processing",
    },
    {
      id: "#78289",
      date: "May 10, 2023",
      total: 349.99,
      items: 2,
      status: "Delivered",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shipped":
        return "text-green-600 bg-green-100";
      case "Processing":
        return "text-blue-600 bg-blue-100";
      case "Delivered":
        return "text-gray-700 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="w-full md:w-[300px] bg-white border border-gray-200 rounded-md p-4">
      <h2 className="text-black font-semibold text-base mb-3">Recent Orders</h2>

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0"
          >
            <div>
              <p className="text-sm font-semibold text-black">
                Order {order.id}
              </p>
              <p className="text-xs text-gray-500">{order.date}</p>
              <p className="text-xs text-gray-600">
                ${order.total} • {order.items} item
                {order.items > 1 ? "s" : ""}
              </p>
            </div>

            <span
              className={`text-[11px] font-medium px-2 py-1 rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-center bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
        View All Orders
      </button>
    </div>
  );
}

export default RecentOrders;
