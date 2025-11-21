"use client";
import React, { useEffect, useState } from "react";
import { getOrders } from "../_lib/vendor";

interface OrderType {
  id: string;
  created_at: string;
  total_amount: number;
  items: number;
  status: string;
}

function RecentOrders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shipped":
      case "shipped":
        return "text-green-600 bg-green-100";
      case "Processing":
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "Delivered":
      case "delivered":
        return "text-gray-700 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOrders();
        const rawOrders = res?.data?.orders || [];

        // Map response to UI format
        const mapped = rawOrders.map((o: any) => ({
          id: o.order_number || o._id || "#00000",
          created_at: o.created_at || "",
          total_amount: o.total_amount || 0,
          items: o.items?.length || 0,
          status: o.status || "Pending",
        }));

        // show only first 3
        setOrders(mapped.slice(0, 3));
      } catch (err) {
        console.log("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ⭐ Skeleton Loader (glass-like shimmer)
  if (loading) {
    return (
      <div className="w-full md:w-[300px] bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-black font-semibold text-base mb-3">Recent Orders</h2>

        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-gray-100 pb-3 animate-pulse"
            >
              <div className="h-3 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 w-20 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="w-full h-8 bg-gray-200 rounded-md mt-4 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[300px] bg-white border border-gray-200 rounded-md p-4">
      <h2 className="text-black font-semibold text-base mb-3">Recent Orders</h2>

      {/* No Orders Fallback */}
      {orders.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-6">
          No recent orders.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0"
          >
            <div>
              <p className="text-sm font-semibold text-black">
                Order #{order.id}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.created_at).toDateString()}
              </p>
              <p className="text-xs text-gray-600">
                ₦{order.total_amount?.toLocaleString()} • {order.items} item
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
