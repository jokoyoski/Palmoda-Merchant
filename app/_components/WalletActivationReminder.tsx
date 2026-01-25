"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../_lib/AuthContext";

export default function WalletActivationReminder() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Check if we should show the reminder
  const shouldShow = () => {
    // Don't show if still loading auth
    if (loading) {
      console.log("WalletActivationReminder: Still loading auth");
      return false;
    }

    // Don't show on login/signup/forgot-password pages
    if (pathname.includes("login") || pathname.includes("signup") || pathname.includes("forgot-password")) {
      console.log("WalletActivationReminder: On public page");
      return false;
    }

    // Don't show if already on payouts page
    if (pathname.includes("/payouts")) {
      console.log("WalletActivationReminder: On payouts page");
      return false;
    }

    // Show if KYC is complete but wallet is not activated
    const isKycComplete = user?.is_bank_information_verified &&
                         user?.is_business_verified &&
                         user?.is_identity_verified;
    const hasWallet = user?.is_wallet_activated;

    console.log("WalletActivationReminder Debug:", {
      user,
      isKycComplete,
      hasWallet,
      loading,
      pathname,
      mounted
    });

    return isKycComplete && !hasWallet;
  };

  const show = shouldShow();
  console.log("WalletActivationReminder: Should show?", show);

  if (!mounted || !show) return null;

  const handleActivate = () => {
    router.push("/payouts");
  };

  console.log("WalletActivationReminder: Rendering modal NOW!");

  const modalContent = (
    <div
      className="fixed inset-0 flex justify-center items-center p-4"
      style={{
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl relative">
        <div className="flex flex-col items-center text-center">
          <div className="bg-orange-100 p-3 rounded-full mb-4">
            <FiAlertCircle className="text-orange-600 text-3xl" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Activate Your Wallet
          </h2>

          <p className="text-gray-600 mb-4">
            Your KYC verification is complete! To start selling and receiving payments,
            please activate your wallet by adding your BVN.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-6">
            <p className="text-sm text-orange-800">
              <strong>Note:</strong> Product Catalog is disabled until you activate your wallet.
            </p>
          </div>

          <button
            onClick={handleActivate}
            className="w-full px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200 font-semibold"
          >
            Activate Wallet Now
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
