"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../_components/ProtectedRoute";
import BackButton from "../../_components/BackButton";
import { Shield } from "lucide-react";
import axios from "axios";
import { useVendorSubscriptions } from "@/app/_lib/useSubscriptions";
import { fetchProducts } from "@/app/_lib/product";

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function parseBackendDate(dateStr?: string) {
  if (!dateStr) return null;
  const isoLike = dateStr.includes(" ") ? dateStr.replace(" ", "T") : dateStr;
  const d = new Date(isoLike);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatShortDate(dateStr?: string | null) {
  const d = parseBackendDate(dateStr || undefined);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrettyDate(d: Date | null) {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysUntil(d: Date | null) {
  if (!d) return null;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function isOnOrAfterLocalDay(now: Date, target: Date) {
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return nowMidnight >= targetMidnight;
}

export default function Page() {
  const router = useRouter();
  const [autoRenew, setAutoRenew] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusChecked, setStatusChecked] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [totalProductsLoading, setTotalProductsLoading] = useState(false);

  const {
    data: subscriptionsRes,
    isLoading: subscriptionsLoading,
    isFetched: subscriptionsFetched,
    isError: subscriptionsIsError,
    error: subscriptionsError,
  } = useVendorSubscriptions({ page_number: 1, page_size: 5 });

  const subscriptions = subscriptionsRes?.data?.subscriptions ?? [];
  const totalItems = subscriptionsRes?.data?.total_items ?? 0;
  const statusSaysSubscribed = !!status?.is_subscribed;
  const accessAllowed = statusSaysSubscribed || subscriptionsIsError;

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

  const statusPillClass = (label: string) => {
    if (label === "Completed") return "bg-green-100 text-green-700";
    if (label === "Failed") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingStatus(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const token = localStorage.getItem("token");
        if (!backendUrl || !token) return;

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const res = await axios.get(`${backendUrl}/vendor/subscription/status`, {
          headers,
        });

        const nextStatus = res?.data?.success ? res.data.data : null;
        if (nextStatus) {
          setStatus(nextStatus);
          if (typeof nextStatus?.auto_renewal === "boolean") {
            setAutoRenew(nextStatus.auto_renewal);
          }

          const expiry = parseBackendDate(nextStatus?.expiry_date);
          if (nextStatus?.is_subscribed && expiry && isOnOrAfterLocalDay(new Date(), expiry)) {
            await axios.post(
              `${backendUrl}/vendor/subscription/deactivate`,
              {},
              {
                headers: {
                  ...headers,
                  "Content-Type": "application/json",
                },
              }
            );

            const refreshed = await axios.get(`${backendUrl}/vendor/subscription/status`, {
              headers,
            });

            const refreshedStatus = refreshed?.data?.success ? refreshed.data.data : null;
            if (refreshedStatus) {
              setStatus(refreshedStatus);
              if (typeof refreshedStatus?.auto_renewal === "boolean") {
                setAutoRenew(refreshedStatus.auto_renewal);
              }
            }
          }
        }
      } catch {
        // ignore
      } finally {
        setStatusChecked(true);
        setLoadingStatus(false);
      }
    };

    run();
  }, [router]);

  useEffect(() => {
    const run = async () => {
      try {
        setTotalProductsLoading(true);
        const res = await fetchProducts(1, 100);
        const products = (res as any)?.data?.data || [];
        setTotalProducts(Array.isArray(products) ? products.length : 0);
      } catch {
        setTotalProducts(null);
      } finally {
        setTotalProductsLoading(false);
      }
    };

    run();
  }, []);

  useEffect(() => {
    if (!statusChecked) return;
    if (!subscriptionsFetched) return;

    if (!subscriptionsIsError && !accessAllowed) {
      router.replace("/subscription?changePlan=1");
    }
  }, [accessAllowed, router, statusChecked, subscriptionsFetched, subscriptionsIsError]);

  const expiryDate = parseBackendDate(status?.expiry_date);
  const expiresInDays = daysUntil(expiryDate);
  const showExpiryBanner = typeof expiresInDays === "number" && expiresInDays <= 5;

  const planLabel = status?.subscription_plan
    ? status.subscription_plan === "annual"
      ? "Annual"
      : `${String(status.subscription_plan).charAt(0).toUpperCase()}${String(status.subscription_plan).slice(1)}`
    : "Plan";

  const planPrice = status?.subscription_plan === "annual" ? 110000 : 10000;
  const cadence = status?.subscription_plan === "annual" ? "year" : "month";

  if (loadingStatus || !statusChecked || subscriptionsLoading || !subscriptionsFetched || (!accessAllowed && subscriptionsIsError)) {
    return (
      <ProtectedRoute>
        <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <BackButton href="/" label="Back to Dashboard" />
              <div>
                <h1 className="text-black font-semibold text-2xl">Subscription & Billing</h1>
                <p className="text-gray-500 text-sm">
                  Manage your plan, billing details, and publishing access for your store.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-900 animate-spin" />
                <p className="text-xs font-semibold text-gray-500">Loading subscription status...</p>
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    );
  }

  if (!accessAllowed) {
    return (
      <ProtectedRoute>
        <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <BackButton href="/" label="Back to Dashboard" />
              <div>
                <h1 className="text-black font-semibold text-2xl">Subscription & Billing</h1>
                <p className="text-gray-500 text-sm">
                  Manage your plan, billing details, and publishing access for your store.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-6 text-center">
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-900 animate-spin" />
                <p className="text-xs font-semibold text-gray-500">Redirecting...</p>
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BackButton href="/" label="Back to Dashboard" />
            <div>
              <h1 className="text-black font-semibold text-2xl">Subscription & Billing</h1>
              <p className="text-gray-500 text-sm">
                Manage your plan, billing details, and publishing access for your store.
              </p>
            </div>
          </div>

          {showExpiryBanner && (
            <div className="rounded-xl bg-yellow-50 border border-yellow-100 px-4 py-3 flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-yellow-700">⚠</span>
                <p className="text-yellow-800 text-sm font-semibold">
                  Your subscription expires in {expiresInDays} day{expiresInDays === 1 ? "" : "s"}. Renew to keep your products live.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/subscription?changePlan=1")}
                className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Renew Now
              </button>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 p-5 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-black font-semibold text-lg">
                    {planLabel} Plan — {formatNaira(planPrice)} / {cadence}
                  </h2>
                  {status?.is_subscribed && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push(status?.is_subscribed ? "/subscription?changePlan=1" : "/subscription")}
                className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                {status?.is_subscribed ? "Change Plan" : "Subscribe"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
              <div>
                <p className="text-gray-500 text-xs font-semibold">Start Date</p>
                <p className="text-gray-900 text-sm font-semibold">
                  {formatPrettyDate(parseBackendDate(status?.last_subscription_date))}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold">Next Billing Date</p>
                <p className="text-gray-900 text-sm font-semibold">{formatPrettyDate(expiryDate)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-gray-200">
              <div>
                <p className="text-gray-900 text-sm font-semibold">Auto-Renewal</p>
                <p className="text-gray-500 text-sm">
                  Automatically renew your subscription when it expires.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAutoRenew((v) => !v)}
                className={`relative w-12 h-7 rounded-full transition-colors overflow-hidden p-0.5 ${
                  autoRenew ? "bg-gray-900" : "bg-gray-300"
                }`}
                aria-label="Toggle automatic renewal"
                aria-pressed={autoRenew}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    autoRenew ? "translate-x-[20px]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="rounded-xl border border-gray-200 p-5">
              <h3 className="text-black font-semibold">Store Publishing Status</h3>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-gray-900 text-sm font-semibold">
                    {totalProductsLoading ? "—" : totalProducts ?? "—"}
                  </p>
                </div>
              </div>

              <p className="text-gray-500 text-sm mt-4">
                Approved products go live only while your subscription is active.
              </p>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-4 w-full bg-gray-100 text-gray-900 py-3 rounded-xl text-xs font-semibold"
              >
                View Products
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 flex items-center justify-center text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Shield className="text-gray-900" size={22} />
                </div>
                <p className="text-black font-semibold">Premium Access</p>
                <p className="text-gray-500 text-sm mt-1">
                  Your store has full publishing rights and priority support
                </p>
                <p className="text-gray-500 text-sm mt-3">
                  Valid until {formatPrettyDate(expiryDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-black font-semibold">Payment History</h3>
              <Link
                href="/subscription/history"
                className="text-xs font-semibold text-gray-900"
              >
                View All
              </Link>
            </div>

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
                  {subscriptionsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500 text-sm">
                        Loading...
                      </td>
                    </tr>
                  ) : subscriptionsIsError ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-red-500 text-sm">
                        {String((subscriptionsError as any)?.message || "Failed to load subscriptions")}
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
                            <button
                              type="button"
                              onClick={() => router.push(`/subscription/${sub._id}`)}
                              className="text-xs font-semibold text-gray-900 underline"
                            >
                              View Receipt
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {loadingStatus && (
            <div className="text-center mt-6">
              <p className="text-xs font-semibold text-gray-500">
                Loading subscription status...
              </p>
            </div>
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}
