"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { vendorSignUp } from "../_lib/vendor";
import VerifyVendorCode from "../_components/ValidateVendorCode";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Page() {
  const [holdBtn, setHoldBtn] = useState(true);
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const verificationBtnRef = useRef<HTMLButtonElement | null>(null);

  // Clear any stale signup cache on mount
  useEffect(() => {
    localStorage.removeItem("vendorSignupState");
  }, []);

  // If there is previous signup success, scroll to verification
  useEffect(() => {
    const saved = localStorage.getItem("vendorSignupState");
    if (saved) {
      const data = JSON.parse(saved);
      if (data.signupSuccess) {
        setSignupSuccess(true);
        setEmail(data.emailRegistered);
      }
    }
  }, []);

  useEffect(() => {
    if (signupSuccess && verificationBtnRef.current) {
      verificationBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [signupSuccess]);

  // Enable/disable signup button
  useEffect(() => {
    if (
      businessName &&
      contactPersonName &&
      email &&
      phoneNumber &&
      password &&
      confirmPassword
    ) {
      setHoldBtn(false);
    } else {
      setHoldBtn(true);
    }
  }, [
    businessName,
    contactPersonName,
    email,
    phoneNumber,
    password,
    confirmPassword,
  ]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !businessName ||
      !contactPersonName ||
      !email ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await vendorSignUp(
      businessName,
      contactPersonName,
      email,
      phoneNumber,
      password,
      confirmPassword
    );
    setLoading(false);

    if (res.success) {
      toast.success("Signup successful! Proceed to verification.");
      setSignupSuccess(true);

      // Save minimal state for OTP
      localStorage.setItem(
        "vendorSignupState",
        JSON.stringify({
          emailRegistered: email,
          signupSuccess: true,
        })
      );
      setStep(2);
    } else {
      toast.error(res.message || "Signup failed");
      setSignupSuccess(false);
      localStorage.removeItem("vendorSignupState");
    }
  };

  // Called after OTP verification
  const handleVerified = () => {
    localStorage.removeItem("vendorSignupState"); // cleanup
    // toast.success("You can now log in!");
    router.push("/login");
  };

  return (
    <div className="bg-white text-black w-full md:w-[500px] px-6 py-3 mx-auto my-10 mt-[-10px] ">
      {step === 1 && (
        <div>
          {/* Header */}
          <h1 className="uppercase text-center text-[16px] font-bold tracking-wide">
            PALMODA
          </h1>
          <h2 className="capitalize text-center text-[18px] mt-2 mb-1 font-semibold">
            Vendor Registration
          </h2>
          <p className="text-gray-500 text-center text-[14px] mb-5">
            Join our marketplace and start selling your fashion products
          </p>

          {/* Form */}
          <form
            onSubmit={handleSignUp}
            className="space-y-4 shadow-lg rounded-lg border border-gray-200 px-6 py-8"
          >
            <div>
              <label className="block text-sm mb-1 font-semibold">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={contactPersonName}
                onChange={(e) => setContactPersonName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (XXX) XXX-XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-0">
                  <Button
                    onPress={() => setShowPassword(!showPassword)}
                    isIconOnly
                    startContent={showPassword ? <FaEye /> : <FaEyeSlash />}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must contain at least 8 characters, including uppercase,
                lowercase, and a number.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Confirm Password
              </label>
              <div className="w-full relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-0">
                  <Button
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    isIconOnly
                    startContent={
                      showConfirmPassword ? <FaEye /> : <FaEyeSlash />
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="terms" className="h-4 w-4" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="#" className="text-black underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-black underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || holdBtn}
              className={`w-full text-[15px] font-medium py-2 rounded-md transition ${
                loading || holdBtn
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 text-white"
              }`}
            >
              {loading ? "Creating Account..." : "CREATE ACCOUNT"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-2">
              Already have a vendor account?{" "}
              <Link href="/login" className="text-black underline">
                Sign In
              </Link>
            </p>
          </form>

          {/* {signupSuccess && (
            <button
              ref={verificationBtnRef}
              onClick={() => setStep(2)}
              disabled={!signupSuccess}
              className="text-right mt-4 text-xs"
            >
              Go to Verification →
            </button>
          )} */}

          {/* Footer note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By joining PALMODA as a vendor, you'll reach fashion-forward
            customers worldwide.{" "}
            <Link href="#" className="text-black underline">
              Vendor Support Team
            </Link>
          </p>
        </div>
      )}

      {step === 2 && (
        <VerifyVendorCode email={email} onVerified={handleVerified}>
          {/* Back to Signup Button */}
          {/* <button
            onClick={() => {
              localStorage.removeItem("vendorSignupState");
              window.location.href = "/signup";
              setStep(1);
              setSignupSuccess(false);
              setPassword("");
              setConfirmPassword("");
              setEmail("");
              setBusinessName("");
              setContactPersonName("");
              setPhoneNumber("");
            }}
            className="text-right mt-4 text-xs"
          >
            ← Back to Signup
          </button> */}
        </VerifyVendorCode>
      )}
    </div>
  );
}

export default Page;
