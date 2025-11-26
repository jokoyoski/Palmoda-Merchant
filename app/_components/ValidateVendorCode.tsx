"use client";
import React, { useState, useRef } from "react";
import { validateVendorCode } from "../_lib/vendor";
import { toast } from "react-toastify";

interface VerifyVendorCodeProps {
  email: string;
  onVerified: () => void;
  children?: React.ReactNode; 
}

const VerifyVendorCode: React.FC<VerifyVendorCodeProps> = ({ email, onVerified, children }) => {
  const CODE_LENGTH = 6; // Number of boxes
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to next input
    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalCode = code.join("");
    if (finalCode.length < CODE_LENGTH) {
      toast.error("Please enter the full verification code");
      return;
    }

    setLoading(true);
    const res = await validateVendorCode(email, finalCode);
    setLoading(false);

    if (res.success) {
      toast.success("Email verified successfully!");
       localStorage.removeItem("vendorSignupState");
      onVerified();
    } else {
      toast.error(res.message || "Verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-30 p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Verify Your Email</h2>
      <p className="text-gray-500 text-sm mb-6 text-center">
        Enter the code sent to <strong>{email}</strong>
      </p>
      <div className="flex justify-between gap-2 mb-6">
        {code.map((num, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={num}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => { inputsRef.current[index] = el; }}
            className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        ))}
      </div>
      <button
  onClick={handleVerify}
  disabled={loading} // Disable while loading
  className={`w-full py-2 rounded-md transition ${
    loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-black hover:bg-gray-800 text-white"
  }`}
>
  {loading ? "Verifying..." : "Verify"}
</button>

<div className="mt-4">{children}</div>


    </div>
  );
};

export default VerifyVendorCode;
