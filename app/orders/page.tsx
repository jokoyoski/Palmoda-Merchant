"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import { useOrdersList } from "../_lib/useOrders";
import ProtectedRoute from "../_components/ProtectedRoute";

function Page() {
  // FILTER STATES
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [reference, setReference] = useState("");

  // PAGINATION
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch orders
  const { data, isLoading, isError } = useOrdersList(1);
  const orders = data?.data?.orders || [];

  // APPLY FILTERS
  const filteredData = useMemo(() => {
    return orders.filter((order) => {
      const itemDate = new Date(order.order_info.transaction_date.$date);

      // Calculate total amount from vendor_orders
      const totalAmount = order.vendor_orders.reduce(
        (sum, vo) => sum + vo.amount,
        0
      );

      if (dateFrom && new Date(dateFrom) > itemDate) return false;
      if (dateTo && new Date(dateTo) < itemDate) return false;
      if (
        status &&
        order.order_info.status.toLowerCase() !== status.toLowerCase()
      )
        return false;
      if (minAmount && totalAmount < Number(minAmount)) return false;
      if (maxAmount && totalAmount > Number(maxAmount)) return false;
      if (
        reference &&
        !order.order_info.transaction_reference
          .toLowerCase()
          .includes(reference.toLowerCase())
      )
        return false;

      return true;
    });
  }, [orders, dateFrom, dateTo, status, minAmount, maxAmount, reference]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Calculate total orders value
  const totalOrdersValue = orders.reduce((sum, order) => {
    return (
      sum +
      order.vendor_orders.reduce(
        (orderSum, vo) => orderSum + vo.amount * vo.quantity,
        0
      )
    );
  }, 0);

  // Skeleton Loader Component
  const TableSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr
          key={i}
          className="border-b border-gray-200 animate-pulse text-center"
        >
          {[...Array(7)].map((_, idx) => (
            <td key={idx} className="p-2">
              <div className="h-3 bg-gray-200 rounded"></div>
            </td>
          ))}
          <td className="p-2">
            <div className="h-3 bg-gray-200 rounded mx-auto w-20"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-black font-semibold text-lg">Orders</h1>
            <p className="text-xs text-gray-500">
              View all your orders, order timeline, and order statuses.
            </p>
          </div>
          <div className="flex gap-2">
            {/* <Link
              href="/payouts"
              className="text-xs text-gray-900 bg-gray-400 rounded-[5px] p-2"
            >
              Withdraw Funds
            </Link> */}
          </div>
        </div>

        {/* STATS CARD */}
        <div className="flex gap-3 my-6 items-center">
          <div className="p-2 bg-gray-200 rounded-[5px]">
            <FaShoppingBag className="text-black text-[25px]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Orders Value</p>
            <h1 className="text-black text-sm font-semibold">
              ₦{totalOrdersValue.toLocaleString()}
            </h1>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 py-3 px-5 border border-gray-200 rounded-md mb-6">
          <div className="flex flex-col">
            <label className="text-xs">Date From</label>
            <input
              type="date"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Date To</label>
            <input
              type="date"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Status</label>
            <select
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Min Amount</label>
            <input
              type="number"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Max Amount</label>
            <input
              type="number"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Reference ID</label>
            <input
              type="text"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              placeholder="Search REF..."
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead>
              <tr>
                <th className="p-2 text-xs">Date</th>
                <th className="p-2 text-xs">Reference</th>
                <th className="p-2 text-xs">Items</th>
                <th className="p-2 text-xs">Total Amount</th>
                <th className="p-2 text-xs">Delivery Fee</th>
                <th className="p-2 text-xs">Customer</th>
                <th className="p-2 text-xs">Status</th>
                <th className="p-2 text-xs">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton />
              ) : paginatedData.length > 0 ? (
                paginatedData.map((order) => {
                  const totalAmount = order.vendor_orders.reduce(
                    (sum, vo) => sum + vo.amount,
                    0
                  );
                  const totalItems = order.vendor_orders.reduce(
                    (sum, vo) => sum + vo.quantity,
                    0
                  );

                  return (
                    <tr
                      key={order._id}
                      className="border-b text-center border-gray-200"
                    >
                      <td className="p-2 text-xs text-gray-500">
                        {
                          new Date(order.order_info.transaction_date.$date)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {order.order_info.transaction_reference}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {totalItems} item{totalItems !== 1 ? "s" : ""}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        ₦{totalAmount.toLocaleString()}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        ₦{order.order_info.delivery_fee.toLocaleString()}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {order.order_info.address.first_name}{" "}
                        {order.order_info.address.last_name}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs ${
                            order.order_info.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.order_info.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : order.order_info.status === "shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.order_info.status.charAt(0).toUpperCase() +
                            order.order_info.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        <Link
                          href={`/orders/${order._id}`}
                          className="border border-gray-200 text-gray-500 text-xs px-4 py-2 rounded my-2 inline-block hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-3 text-gray-500">
                    {isError
                      ? "Error loading orders. Please try again."
                      : "No orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-end gap-4 items-center mt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="p-2 text-sm border rounded disabled:opacity-50"
            disabled={page === 1}
          >
            Previous
          </button>

          <p className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </p>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="p-2 text-sm border rounded disabled:opacity-50"
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default Page;
