"use client";
import React, { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import BackButton from "../_components/BackButton";
import { getVendorSubscriptions } from "../_lib/subscription";
import { toast } from "react-toastify";

type Subscription = {
  _id: string;
  vendor_id: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

function page() {
  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState<Subscription[]>([]);

  const activeSubs = useMemo(
    () => subs.filter((s) => s?.is_active === true),
    [subs]
  );

  useEffect(() => {
    const fetchSubs = async () => {
      setLoading(true);
      try {
        const res = await getVendorSubscriptions();
        if (res?.success === false) {
          toast.error(res?.message || "Failed to fetch subscriptions");
          setSubs([]);
          return;
        }
        const data = Array.isArray(res?.data) ? res.data : [];
        setSubs(data);
      } catch (e: any) {
        toast.error(e?.message || "Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubs();
  }, []);

  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="w-full md:w-[700px] lg:w-[900px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BackButton />
              <div>
                <h1 className="text-black font-semibold text-xl">Subscriptions</h1>
                <p className="text-gray-500 text-[13px] mt-1">
                  View your subscription status.
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-200 bg-white mt-5 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-black font-semibold text-sm">Your Subscriptions</h2>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const res = await getVendorSubscriptions();
                    if (res?.success === false) {
                      toast.error(res?.message || "Failed to fetch subscriptions");
                      return;
                    }
                    const data = Array.isArray(res?.data) ? res.data : [];
                    setSubs(data);
                  } catch (e: any) {
                    toast.error(e?.message || "Failed to fetch subscriptions");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="text-xs px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <hr className="my-3 border-gray-200" />

            {loading ? (
              <p className="text-sm text-gray-600">Loading subscriptions...</p>
            ) : subs.length === 0 ? (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                <p className="text-sm text-orange-900 font-semibold">
                  No subscriptions found
                </p>
                <p className="text-sm text-orange-800 mt-1">
                  You currently do not have an active subscription.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {subs.map((s) => (
                  <div
                    key={s._id}
                    className="border border-gray-200 rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-black">Subscription</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {s.start_date ? `Start: ${s.start_date}` : ""}
                        {s.end_date ? `  •  End: ${s.end_date}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          s.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {s.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}

                {activeSubs.length === 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                    <p className="text-sm text-orange-800">
                      You have subscriptions, but none is currently active.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default page;
