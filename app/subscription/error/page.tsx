"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../_components/ProtectedRoute";
import BackButton from "../../_components/BackButton";

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
  const router = useRouter();
  const [attempt, setAttempt] = React.useState<SubscriptionAttempt | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("merchant_last_subscription_attempt");
      if (!raw) return;
      const parsed = JSON.parse(raw) as SubscriptionAttempt;
      if (!parsed?.subscriptionReference) return;
      setAttempt(parsed);
    } catch {
      // ignore
    }
  }, []);

  const retrySame = () => {
    if (!attempt) {
      router.push("/subscription");
      return;
    }
    router.push(`/subscription?changePlan=1&plan=${attempt.planId}&method=${attempt.paymentMethod}`);
  };

  const retryCard = () => {
    const plan = attempt?.planId;
    router.push(plan ? `/subscription?changePlan=1&plan=${plan}&method=card` : "/subscription?changePlan=1&method=card");
  };

  const retryBank = () => {
    const plan = attempt?.planId;
    router.push(plan ? `/subscription?changePlan=1&plan=${plan}&method=bank` : "/subscription?changePlan=1&method=bank");
  };

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BackButton href="/subscription" label="Back to Subscription" />
            <h1 className="text-black font-semibold text-2xl">Subscription</h1>
          </div>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <span className="text-red-700 text-2xl font-semibold">!</span>
            </div>
            <p className="text-red-600 font-semibold text-2xl">Payment Failed</p>
            <p className="text-gray-600 text-sm mt-2 max-w-xl">
              We’re sorry, but your subscription payment could not be processed successfully.
            </p>
            <p className="text-gray-500 text-xs mt-2">Your subscription has not been activated at this time.</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-xl border border-red-100 bg-red-50 p-5">
              <p className="text-gray-900 font-semibold text-sm mb-2">What Went Wrong?</p>
              <p className="text-gray-700 text-sm">
                There was an issue processing your payment. This could be due to insufficient funds,
                incorrect payment details, or a temporary issue with your payment provider. Please
                verify your payment information and try again.
              </p>

              {attempt?.subscriptionReference && (
                <div className="mt-4 rounded-lg bg-white/70 border border-red-100 p-4 text-left">
                  <p className="text-gray-500 text-xs font-semibold mb-2">Last attempt</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-500 text-xs">Plan</p>
                      <p className="text-gray-900 text-sm font-semibold">
                        {attempt.planId === "annual" ? "Annual" : "Monthly"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Amount</p>
                      <p className="text-gray-900 text-sm font-semibold">{formatNaira(attempt.amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Method</p>
                      <p className="text-gray-900 text-sm font-semibold">
                        {attempt.paymentMethod === "bank" ? "Bank Transfer" : "Card"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Reference</p>
                      <p className="text-gray-900 text-sm font-semibold break-all">
                        {attempt.subscriptionReference}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-gray-900 font-semibold text-sm mb-4">Choose an Option to Continue</p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={retrySame}
                  className="w-full rounded-xl bg-lime-300 hover:bg-lime-400 text-gray-900 py-3 text-sm font-semibold"
                >
                  Retry Payment with Same Method
                </button>

                <div className="text-center text-xs text-gray-400">OR</div>

                <button
                  type="button"
                  onClick={retryCard}
                  className="w-full rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-900 py-3 text-sm font-semibold"
                >
                  Try Another Card
                </button>

                <button
                  type="button"
                  onClick={retryBank}
                  className="w-full rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-900 py-3 text-sm font-semibold"
                >
                  Try Bank Transfer
                </button>
              </div>

              <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-5 text-left">
                <p className="text-gray-900 font-semibold text-sm mb-2">Need Help with Payment?</p>
                <p className="text-gray-600 text-sm">
                  Our support team is available to assist you with payment processing issues.
                </p>
                <div className="mt-4">
                  <Link
                    href="/subscription/history"
                    className="inline-flex justify-center items-center rounded-xl bg-gray-900 text-white px-5 py-3 text-sm font-semibold"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/subscription" className="text-xs font-semibold text-gray-700">
                Return to Plan Selection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
