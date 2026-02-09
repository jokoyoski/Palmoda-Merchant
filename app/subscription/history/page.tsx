"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "../../_components/ProtectedRoute";
import BackButton from "../../_components/BackButton";
import { useVendorSubscriptions } from "@/app/_lib/useSubscriptions";

type HistoryItem = {
  id: string;
  date: string;
  amount: number;
  plan: string;
  method: string;
  status: "Completed" | "Failed" | "Pending";
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function formatShortDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  const isoLike = String(dateStr).includes(" ")
    ? String(dateStr).replace(" ", "T")
    : String(dateStr);
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Page() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    data: subscriptionsRes,
    isLoading,
    isError,
    error,
  } = useVendorSubscriptions({ page_number: page, page_size: pageSize });

  const subscriptions = subscriptionsRes?.data?.subscriptions ?? [];
  const totalItems = subscriptionsRes?.data?.total_items ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const toPlanLabel = (t?: string) => {
    if (!t) return "—";
    const normalized = String(t).toLowerCase();
    if (normalized === "anually" || normalized === "annual") return "Annual";
    if (normalized === "monthly") return "Monthly";
    return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
  };

  const toStatusLabel = (s?: string) => {
    const normalized = String(s || "").toLowerCase();
    if (normalized.startsWith("success")) return "Completed";
    if (normalized === "failed" || normalized === "failure") return "Failed";
    if (normalized === "pending") return "Pending";
    return "Pending";
  };

  const statusPillClass = (statusLabel: string) => {
    if (statusLabel === "Completed") return "bg-green-100 text-green-700";
    if (statusLabel === "Failed") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BackButton href="/subscription/dashboard" label="Back to Subscription" />
            <div>
              <h1 className="text-black font-semibold text-2xl">Payment History</h1>
              <p className="text-gray-500 text-sm">All subscription payments and receipts.</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 text-xs border-b">
                    <th className="py-3">Date</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Plan</th>
                    <th className="py-3">Payment Method</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500 text-sm">
                        Loading...
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-red-500 text-sm">
                        {String((error as any)?.message || "Failed to load subscriptions")}
                      </td>
                    </tr>
                  ) : subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500 text-sm">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((sub) => {
                      const statusLabel = toStatusLabel(sub.payment_status);
                      return (
                        <tr key={sub._id} className="border-b">
                          <td className="py-3 text-gray-700">
                            {formatShortDate(sub.created_at)}
                          </td>
                          <td className="py-3 text-gray-900 font-semibold">
                            {formatNaira(Number(sub.amount) || 0)}
                          </td>
                          <td className="py-3 text-gray-700">{toPlanLabel(sub.subscription_type)} Plan</td>
                          <td className="py-3 text-gray-700">
                            {sub.payment_method ? `${String(sub.payment_method).charAt(0).toUpperCase()}${String(sub.payment_method).slice(1)}` : "—"}
                          </td>
                          <td className="py-3">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusPillClass(statusLabel)}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="py-3">
                            <Link
                              href={`/subscription/${sub._id}`}
                              className="text-xs font-semibold text-gray-900 underline"
                            >
                              View Receipt
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-4 items-center mt-4">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="p-2 text-sm border rounded disabled:opacity-50"
              disabled={page === 1 || isLoading}
            >
              Previous
            </button>

            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="p-2 text-sm border rounded disabled:opacity-50"
              disabled={page === totalPages || isLoading}
            >
              Next
            </button>
          </div>

          <div className="text-center mt-6">
            <Link href="/subscription/dashboard" className="text-xs font-semibold text-gray-500">
              Back to Subscription & Billing
            </Link>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
