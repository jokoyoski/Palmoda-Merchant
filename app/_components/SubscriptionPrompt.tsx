"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiAlertCircle } from "react-icons/fi";

interface SubscriptionPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onPayNow: (payload: {
    plan: "monthly" | "yearly";
    amount: number;
    paymentMethod: "card" | "bank_transfer";
  }) => void;
  onPaymentMethodSelect?: (method: "card" | "bank_transfer") => void;
}

export default function SubscriptionPrompt({
  isOpen,
  onClose,
  onPayNow,
  onPaymentMethodSelect,
}: SubscriptionPromptProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly" | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "bank_transfer" | null
  >(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!paymentMethod) return;
    onPaymentMethodSelect?.(paymentMethod);
  }, [paymentMethod, onPaymentMethodSelect]);

  if (!isOpen || !mounted) return null;

  type Plan = {
    label: string;
    amount: number;
    billing: string;
    features: string[];
    badge?: string;
  };

  const plans: Record<"monthly" | "yearly", Plan> = {
    monthly: {
      label: "Monthly",
      amount: 100,
      billing: "Billed monthly",
      features: [
        "Full access to Palmoda platform",
        "Product uploading",
        "Customer management",
        "Live product listing",
        "Support access",
      ],
    },
    yearly: {
      label: "Yearly",
      amount: 200,
      billing: "Billed annually",
      badge: "Best Value",
      features: [
        "Full access to Palmoda platform",
        "Product uploading",
        "Customer management",
        "Live product listing",
        "Support access",
      ],
    },
  };

  const canPay = selectedPlan !== null && paymentMethod !== null;

  const handlePayNow = () => {
    if (!selectedPlan || !paymentMethod) return;
    const amount = plans[selectedPlan].amount;
    onPayNow({ plan: selectedPlan, amount, paymentMethod });
  };

  const formatNaira = (value: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(value);

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100000] p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <FiAlertCircle className="text-orange-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Subscription</h2>
              <p className="text-gray-600 text-sm">
                Choose your plan to enable product uploads.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-sm"
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-5">
          <p className="text-xs text-gray-500 mb-2">CHOOSE YOUR PLAN</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => {
              const plan = plans[key];
              const active = selectedPlan === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPlan(key)}
                  className={`text-left border rounded-lg p-4 transition-colors ${
                    active
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatNaira(plan.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{plan.billing}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {plan.badge && (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-black text-white">
                          {plan.badge}
                        </span>
                      )}
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          active ? "border-black" : "border-gray-300"
                        }`}
                      >
                        {active && (
                          <span className="w-2 h-2 rounded-full bg-black" />
                        )}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-gray-700">
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs text-gray-500 mb-2">PAYMENT METHOD</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`w-full text-left border rounded-md p-3 flex items-center justify-between ${
                paymentMethod === "card"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <span className="text-sm text-gray-900">Card Payment</span>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "card" ? "border-black" : "border-gray-300"
                }`}
              >
                {paymentMethod === "card" && (
                  <span className="w-2 h-2 rounded-full bg-black" />
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("bank_transfer")}
              className={`w-full text-left border rounded-md p-3 flex items-center justify-between ${
                paymentMethod === "bank_transfer"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <span className="text-sm text-gray-900">Bank Transfer</span>
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "bank_transfer"
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "bank_transfer" && (
                  <span className="w-2 h-2 rounded-full bg-black" />
                )}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handlePayNow}
            type="button"
            disabled={!canPay}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              canPay
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
