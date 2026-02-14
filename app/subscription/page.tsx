"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import ProtectedRoute from "../_components/ProtectedRoute";
import BackButton from "../_components/BackButton";
import { useAuth } from "../_lib/AuthContext";
import { PayazaCheckoutOptionsInterface } from "payaza-web-sdk/lib/PayazaCheckoutDataInterface";
import PayazaCallbackResponse from "payaza-web-sdk/lib/PayazaCallbackData";
import Swal from "sweetalert2";

type PlanId = "monthly" | "annual";

type SubscriptionAttempt = {
  subscriptionId: string;
  subscriptionReference: string;
  planId: PlanId;
  amount: number;
  createdAt: number;
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const changePlan = searchParams?.get("changePlan") === "1";
  const preselectedPlan = searchParams?.get("plan") as PlanId | null;
  const { user } = useAuth();

  const [checkingStatus, setCheckingStatus] = useState(!changePlan);

  const [currentPlanId, setCurrentPlanId] = useState<PlanId | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);
  const [loadingCurrentPlan, setLoadingCurrentPlan] = useState<boolean>(false);

  const [subscribing, setSubscribing] = useState(false);

  const plans = useMemo(
    () =>
      [
        {
          id: "monthly" as const,
          price: 15000,
          cadence: "Billed monthly",
          highlight: false,
        },
        {
          id: "annual" as const,
          price: 120000,
          cadence: "Billed annually",
          highlight: true,
          badge: "Best Value",
        },
      ],
    []
  );

  const features = useMemo(
    () =>
      [
        "Full access to Palmoda platform",
        "Product publishing",
        "Customer management",
        "Live product listing",
        "Support access",
      ],
    []
  );

  const [selectedPlan, setSelectedPlan] = useState<PlanId>("monthly");

  React.useEffect(() => {
    if (preselectedPlan === "monthly" || preselectedPlan === "annual") {
      setSelectedPlan(preselectedPlan);
    }
  }, [preselectedPlan]);

  React.useEffect(() => {
    if (!changePlan) return;

    const run = async () => {
      try {
        setLoadingCurrentPlan(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const token = localStorage.getItem("token");
        if (!backendUrl || !token) return;

        const res = await axios.get(`${backendUrl}/vendor/subscription/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res?.data?.data;
        const isSubscribed = !!data?.is_subscribed;
        setHasActiveSubscription(isSubscribed);

        const rawPlan = String(data?.subscription_plan || "").toLowerCase();
        const normalizedPlan: PlanId | null = rawPlan.startsWith("ann")
          ? "annual"
          : rawPlan.startsWith("mon")
          ? "monthly"
          : null;

        setCurrentPlanId(normalizedPlan);

        if (isSubscribed && normalizedPlan) {
          setSelectedPlan((prev) => {
            if (prev !== normalizedPlan) return prev;
            const other = normalizedPlan === "annual" ? "monthly" : "annual";
            return other;
          });
        }
      } catch {
        // ignore
      } finally {
        setLoadingCurrentPlan(false);
      }
    };

    run();
  }, [changePlan]);

  type PayazaConnectionMode = PayazaCheckoutOptionsInterface["connection_mode"];

  const launchPayazaCheckout = async (amount: number, subscriptionReference: string) => {
    if (typeof window === "undefined") return;

    const merchantKey = process.env.NEXT_PUBLIC_PAYAZA_MERCHANT_KEY;
    const isDev = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === "true";

    if (!merchantKey) {
      toast.error("Payment configuration is missing");
      setSubscribing(false);
      return;
    }

    let firstName = user?.first_name || "";
    let lastName = user?.last_name || "";

    if (!firstName || !lastName) {
      const contactName = user?.contact_person_name || user?.business_name || "";
      const nameParts = contactName.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        firstName = firstName || nameParts[0];
        lastName = lastName || nameParts.slice(1).join(" ");
      } else if (nameParts.length === 1 && nameParts[0]) {
        firstName = firstName || nameParts[0];
        lastName = lastName || nameParts[0];
      }
    }

    if (!user?.email || !firstName || !lastName) {
      toast.error("User information is incomplete. Please update your profile.");
      setSubscribing(false);
      return;
    }

    try {
      let didSucceed = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const PayazaCheckoutModule: any = await import("payaza-web-sdk/lib/PayazaCheckout");

      const PayazaCheckout = (PayazaCheckoutModule.default?.default || PayazaCheckoutModule.default) as
        | (new (config: PayazaCheckoutOptionsInterface) => { showPopup: () => void })
        | undefined;
      const ConnectionMode = (PayazaCheckoutModule.ConnectionMode || PayazaCheckoutModule.default?.ConnectionMode) as
        | { LIVE: PayazaConnectionMode; TEST: PayazaConnectionMode }
        | undefined;

      if (!PayazaCheckout || !ConnectionMode) {
        toast.error("Payment SDK failed to load. Please refresh and try again.");
        setSubscribing(false);
        return;
      }

      const checkoutConfig: PayazaCheckoutOptionsInterface = {
        merchant_key: merchantKey,
        connection_mode: isDev ? ConnectionMode.TEST : ConnectionMode.LIVE,
        currency: "Naira",
        checkout_amount: Number(amount),
        currency_code: "NGN",
        email_address: user.email,
        first_name: firstName,
        last_name: lastName,
        phone_number: user.phone_number || "",
        transaction_reference: subscriptionReference,
        onClose: () => {
          if (didSucceed) return;

          try {
            const status = localStorage.getItem("merchant_subscription_payment_status");
            if (status === "success") return;
          } catch {
            // ignore
          }

          try {
            localStorage.setItem("merchant_subscription_payment_status", "failed");
          } catch {
            // ignore
          }

          setSubscribing(false);
          router.push("/subscription/error");
        },
        callback: (response: object) => {
          const r = response as PayazaCallbackResponse;

          if (r?.type === "success") {
            didSucceed = true;
            try {
              localStorage.setItem("merchant_subscription_payment_status", "success");
            } catch {
              // ignore
            }

            setSubscribing(false);
            router.push("/subscription/success");
          } else {
            try {
              localStorage.setItem("merchant_subscription_payment_status", "failed");
            } catch {
              // ignore
            }

            setSubscribing(false);
            router.push("/subscription/error");
          }
        },
      };

      (checkoutConfig as unknown as Record<string, unknown>).channel = ["card"];

      const payazaCheckout = new PayazaCheckout(checkoutConfig);

      try {
        payazaCheckout.showPopup();
      } catch (popupErr) {
        // eslint-disable-next-line no-console
        console.error("Payaza checkout: showPopup() threw", popupErr);
        toast.error("Checkout popup was blocked or failed to open. Please allow popups and try again.");
        setSubscribing(false);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Payaza init error:", err);
      toast.error("Failed to initialize payment. Please try again.");
      setSubscribing(false);
    }
  };

  React.useEffect(() => {
    if (changePlan) return;

    const run = async () => {
      let shouldStopLoading = true;
      try {
        setCheckingStatus(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const token = localStorage.getItem("token");
        if (!backendUrl || !token) return;

        const res = await axios.get(`${backendUrl}/vendor/subscription/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res?.data?.success && res.data.data?.is_subscribed) {
          shouldStopLoading = false;
          router.replace("/subscription/dashboard");
          return;
        }

        const historyRes = await axios.get(`${backendUrl}/vendor/subscriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page_number: 1,
            page_size: 1,
          },
        });

        if (historyRes?.data?.success && (historyRes.data.data?.total_items ?? 0) > 0) {
          shouldStopLoading = false;
          router.replace("/subscription/dashboard");
          return;
        }
      } catch {
        // ignore
      } finally {
        if (shouldStopLoading) {
          setCheckingStatus(false);
        }
      }
    };

    run();
  }, [changePlan, router]);

  if (checkingStatus) {
    return (
      <ProtectedRoute>
        <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <BackButton href="/" label="Back to Dashboard" />
              <h1 className="text-black font-semibold text-2xl">Subscription</h1>
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

  const handleSubscribe = async () => {
    if (subscribing) return;

    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan) {
      toast.error("Please select a plan");
      return;
    }

    try {
      setSubscribing(true);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem("token");

      if (!backendUrl) {
        toast.error("Backend URL is not configured");
        setSubscribing(false);
        return;
      }

      if (!token) {
        toast.error("You need to be logged in to subscribe");
        setSubscribing(false);
        return;
      }

      const payload = {
        subscription_type: selectedPlan === "annual" ? "annually" : selectedPlan,
        amount: plan.price,
        auto_renew: true,
      };

      const res = await axios.post(`${backendUrl}/vendor/subscribe`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res?.data?.success) {
        const msg = String(res?.data?.message || "Subscription initiation failed");
        if (msg.toLowerCase().includes("active subscription")) {
          await Swal.fire({
            title: "Subscription active",
            text: msg,
            icon: "info",
            confirmButtonColor: "#000000",
            customClass: {
              container: "!z-[100000]",
            },
          });
          setSubscribing(false);
          router.push("/subscription/dashboard");
          return;
        }

        toast.error(msg);
        setSubscribing(false);
        return;
      }

      const data = res?.data?.data;
      const subscriptionId = data?.subscription_id || "";
      const subscriptionReference = data?.subscription_reference || "";

      if (!subscriptionReference) {
        toast.error("Subscription reference missing");
        setSubscribing(false);
        return;
      }

      try {
        if (subscriptionId) {
          localStorage.setItem("merchant_subscription_id", subscriptionId);
        }
        localStorage.setItem("merchant_subscription_reference", subscriptionReference);
        localStorage.setItem("merchant_subscription_payment_status", "pending");

        const attempt: SubscriptionAttempt = {
          subscriptionId,
          subscriptionReference,
          planId: selectedPlan,
          amount: plan.price,
          createdAt: Date.now(),
        };
        localStorage.setItem("merchant_last_subscription_attempt", JSON.stringify(attempt));
      } catch {
        // ignore
      }

      await launchPayazaCheckout(plan.price, subscriptionReference);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(axiosErr?.response?.data?.message || axiosErr?.message || "Subscription initiation failed");
      setSubscribing(false);
    }
  };

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-8 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BackButton href="/" label="Back to Dashboard" />
            <h1 className="text-black font-semibold text-3xl">Subscription</h1>
          </div>

          <div className="mb-4">
            <p className="text-gray-500 text-xs font-semibold tracking-wide">
              CHOOSE YOUR PLAN
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isCurrentPlanDisabled =
                changePlan &&
                !loadingCurrentPlan &&
                hasActiveSubscription &&
                currentPlanId === plan.id;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => {
                    if (isCurrentPlanDisabled) return;
                    setSelectedPlan(plan.id);
                  }}
                  disabled={isCurrentPlanDisabled}
                  title={
                    isCurrentPlanDisabled
                      ? "You are currently subscribed to this plan"
                      : plan.id === "monthly"
                      ? "Select monthly plan"
                      : "Select annual plan"
                  }
                  className={`text-left rounded-xl border p-6 transition-colors ${
                    isSelected ? "border-gray-900" : "border-gray-200"
                  } ${
                    isCurrentPlanDisabled
                      ? "opacity-60 cursor-not-allowed blur-[1px]"
                      : ""
                  }`}
                  aria-label={plan.id === "monthly" ? "Select monthly plan" : "Select annual plan"}
                  aria-disabled={isCurrentPlanDisabled}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-3xl font-semibold text-black">
                        {formatNaira(plan.price)}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">{plan.cadence}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {plan.highlight && plan.badge && (
                        <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-gray-900" : "border-gray-300"
                        }`}
                      >
                        {isSelected && <span className="w-2.5 h-2.5 bg-gray-900 rounded-full" />}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <span className="text-black text-sm leading-5">✓</span>
                        <p className="text-gray-700 text-sm">{f}</p>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={subscribing}
              className="w-full bg-gray-900 text-white py-4 rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {subscribing ? "Subscribing..." : "Subscribe Now"}
            </button>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
