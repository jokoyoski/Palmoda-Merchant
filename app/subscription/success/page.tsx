"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "../../_components/ProtectedRoute";
import BackButton from "../../_components/BackButton";
import { CheckCircle2 } from "lucide-react";

type PlanId = "monthly" | "annual";
type PaymentMethodId = "card" | "bank";

type SubscriptionAttempt = {
  subscriptionId: string;
  subscriptionReference: string;
  planId: PlanId;
  amount: number;
  paymentMethod: PaymentMethodId;
  autoPay: boolean;
  createdAt: number;
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default function Page() {
  const [attempt, setAttempt] = React.useState<SubscriptionAttempt | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("merchant_last_subscription_attempt");
      if (!raw) return;
      const parsed = JSON.parse(raw) as SubscriptionAttempt;
      if (!parsed?.amount) return;
      setAttempt(parsed);
    } catch {
      // ignore
    }
  }, []);

  const cadenceLabel = attempt?.planId === "annual" ? "/ year" : "/ month";
  const billedLabel = attempt?.planId === "annual" ? "Billed annually" : "Billed monthly";

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BackButton href="/subscription" label="Back to Subscription" />
            <h1 className="text-black font-semibold text-2xl">Subscription</h1>
          </div>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="text-green-600" size={28} />
            </div>
            <p className="text-black font-semibold">Subscription Successful!</p>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              Welcome to Palmoda! Your subscription is now active and ready to use.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 bg-white">
                <p className="text-gray-500 text-xs font-semibold mb-3">
                  Your Plan Details
                </p>

                <div className="flex items-end gap-2 mb-1">
                  <p className="text-black font-semibold text-2xl">
                    {formatNaira(attempt?.amount ?? 0)}
                  </p>
                  <p className="text-gray-500 text-sm">{cadenceLabel}</p>
                </div>
                <p className="text-gray-500 text-sm">{billedLabel}</p>

                <div className="mt-6">
                  <p className="text-gray-500 text-xs font-semibold mb-3">
                    Features included
                  </p>

                  <div className="space-y-2">
                    {[
                      "Full access to Palmoda platform",
                      "Product publishing",
                      "Customer management",
                      "Live product listing",
                      "Support access",
                    ].map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <span className="text-green-600 text-sm">✓</span>
                        <p className="text-gray-700 text-sm">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {attempt?.autoPay && (
                  <div className="mt-6 rounded-lg bg-green-50 border border-green-100 p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-green-700 text-sm">✓</span>
                      <div>
                        <p className="text-black font-semibold text-sm">
                          Automatic Renewal Enabled
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Your subscription will automatically renew automatically.
                          You can manage or cancel your subscription anytime from your account settings.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 bg-white border-t border-gray-200">
                <button
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  View Storefront
                </button>

                <div className="flex items-center justify-between mt-4">
                  <Link href="/subscription" className="text-sm font-semibold text-gray-900">
                    View Subscription Details
                  </Link>
                  <button
                    type="button"
                    className="text-sm font-semibold text-gray-900"
                    onClick={() => console.log("Download receipt")}
                  >
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-500 text-xs">
                Need help? Contact our support team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
