"use client";
import React, { useState } from "react";
import { resendCode, validateVendorCode, updatePassword } from "../_lib/vendor";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  // Loading states for each action
  const [sendingCode, setSendingCode] = useState(false);
  const [validatingOtp, setValidatingOtp] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const router = useRouter();

  // STEP 1 — SEND CODE
  const handleSendCode = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setSendingCode(true);
    const res = await resendCode(email);
    setSendingCode(false);

    if (res.success !== false) {
      toast.success("Verification code sent!");
      setStep(2);
    } else {
      toast.error(res.message);
    }
  };

  // STEP 2 — VALIDATE OTP
  const handleValidateOtp = async () => {
    if (!otp.trim()) {
      toast.error("OTP code is required");
      return;
    }

    setValidatingOtp(true);
    const res = await validateVendorCode(email, otp);
    setValidatingOtp(false);

    if (res.success !== false) {
      toast.success("OTP verified!");
      setStep(3);
    } else {
      toast.error(res.message);
    }
  };

  // STEP 3 — UPDATE PASSWORD
  const handleUpdatePassword = async () => {
    if (!password.trim()) {
      toast.error("Password cannot be empty");
      return;
    }

    setUpdatingPassword(true);
    const res = await updatePassword(email, password);
    setUpdatingPassword(false);

    if (res.success !== false) {
      toast.success("Password updated successfully!");
       router.push("/login");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 transition-all duration-300">
        {/* HEADER */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {/* Step 1 - Email */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-black focus:ring-2 focus:ring-black/20"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <button
              onClick={handleSendCode}
              disabled={sendingCode}
              className={`w-full py-2 rounded-lg text-white transition ${
                sendingCode ? "bg-gray-500" : "bg-black hover:bg-gray-900"
              }`}
            >
              {sendingCode ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* Step 2 - OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-black focus:ring-2 focus:ring-black/20"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />

            <button
              onClick={handleValidateOtp}
              disabled={validatingOtp}
              className={`w-full py-2 rounded-lg text-white transition ${
                validatingOtp ? "bg-gray-500" : "bg-black hover:bg-gray-900"
              }`}
            >
              {validatingOtp ? "Verifying..." : "Verify Code"}
            </button>

            <button
              onClick={handleSendCode}
              className="w-full text-sm text-gray-600 hover:text-black underline"
            >
              Resend Code
            </button>
          </div>
        )}

        {/* Step 3 - New Password */}
        {step === 3 && (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-black focus:ring-2 focus:ring-black/20"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <button
              onClick={handleUpdatePassword}
              disabled={updatingPassword}
              className={`w-full py-2 rounded-lg text-white transition ${
                updatingPassword ? "bg-gray-500" : "bg-black hover:bg-gray-900"
              }`}
            >
              {updatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
