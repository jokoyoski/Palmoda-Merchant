"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProtectedRoute from "../../_components/ProtectedRoute";
import BackButton from "../../_components/BackButton";
import { useVendorSubscriptionDetails } from "@/app/_lib/useSubscriptions";

function formatNaira(amount?: number) {
  const value = Number(amount);
  if (Number.isNaN(value)) return "—";
  return `₦${value.toLocaleString()}`;
}

function formatPrettyDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  const d = new Date(String(dateStr).replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function titleCase(value?: string | null) {
  if (!value) return "—";
  const s = String(value);
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}

function normalizePlan(plan?: string | null) {
  if (!plan) return "—";
  const normalized = String(plan).toLowerCase();
  if (normalized === "anually" || normalized === "annual") return "Annual";
  if (normalized === "monthly") return "Monthly";
  return titleCase(normalized);
}

function normalizeStatus(status?: string | null) {
  if (!status) return "—";
  const normalized = String(status).toLowerCase();
  if (normalized.startsWith("success")) return "Success";
  if (normalized === "failed" || normalized === "failure") return "Failed";
  if (normalized === "pending") return "Pending";
  return titleCase(normalized);
}

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, isError, error } = useVendorSubscriptionDetails(id);
  const sub = data?.data;

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BackButton href="/subscription/history" label="Back to History" />
            <div>
              <h1 className="text-black font-semibold text-2xl">Subscription Details</h1>
              <p className="text-gray-500 text-sm">View subscription payment and plan information.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-gray-200 p-6 text-center text-gray-500 text-sm">Loading...</div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 text-sm">
              {String((error as any)?.message || "Failed to load subscription details")}
            </div>
          ) : !sub ? (
            <div className="rounded-xl border border-gray-200 p-6 text-center text-gray-500 text-sm">No data found.</div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">Subscription Reference</p>
                    <p className="text-gray-900 font-semibold text-lg break-all">{sub.subscription_reference || "—"}</p>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {normalizeStatus(sub.payment_status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">Plan</p>
                    <p className="text-gray-900 text-sm font-semibold">{normalizePlan(sub.subscription_type)} Plan</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">Amount</p>
                    <p className="text-gray-900 text-sm font-semibold">{formatNaira(sub.amount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">Payment Method</p>
                    <p className="text-gray-900 text-sm font-semibold">{titleCase(sub.payment_method)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">Auto Renew</p>
                    <p className="text-gray-900 text-sm font-semibold">{sub.auto_renew ? "Enabled" : "Disabled"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-6">
                <h2 className="text-black font-semibold mb-4">Dates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">Created At</p>
                    <p className="text-gray-900 text-sm font-semibold">{formatPrettyDate(sub.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">Payment Date</p>
                    <p className="text-gray-900 text-sm font-semibold">{formatPrettyDate(sub.payment_date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">Expiry Date</p>
                    <p className="text-gray-900 text-sm font-semibold">{formatPrettyDate(sub.expiry_date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold">Updated At</p>
                    <p className="text-gray-900 text-sm font-semibold">{formatPrettyDate(sub.updated_at)}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link href="/subscription/history" className="text-xs font-semibold text-gray-900 underline">
                  Back to Payment History
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
