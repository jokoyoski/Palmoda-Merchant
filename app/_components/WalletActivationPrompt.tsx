"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";

interface WalletActivationPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletActivationPrompt({
  isOpen,
  onClose,
}: WalletActivationPromptProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleActivate = () => {
    onClose();
    router.push("/payouts");
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="bg-orange-100 p-3 rounded-full mb-4">
            <FiAlertCircle className="text-orange-600 text-3xl" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Activate Your Wallet
          </h2>

          <p className="text-gray-600 mb-6">
            To perform this operation, you need to activate your wallet first.
            This will enable you to receive payments and manage your funds.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleActivate}
              className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Activate Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
