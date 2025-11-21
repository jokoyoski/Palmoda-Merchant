"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { vendorSignUp, validateVendorCode } from "../_lib/vendor";
import VerifyVendorCode from "../_components/ValidateVendorCode";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [pendingVerification, setPendingVerification] = useState(false);
  const router = useRouter();

  // check localStorage on mount
  useEffect(() => {
    const pending = localStorage.getItem("vendorPendingVerification");
    if (pending) {
      const data = JSON.parse(pending);
      setEmail(data.email);
      setPendingVerification(true);
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName || !contactPersonName || !email || !phoneNumber || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await vendorSignUp(businessName, contactPersonName, email, phoneNumber, password, confirmPassword);
    setLoading(false);

    if (res.success) {
      toast.success("Signup successful! Verify your email.");
      // save pending verification in localStorage
      localStorage.setItem("vendorPendingVerification", JSON.stringify({ email }));
      setPendingVerification(true);
    } else {
      toast.error(res.message || "Signup failed");
    }
  };

  // after verification is done
  const handleVerified = () => {
    setPendingVerification(false);
    toast.success("You can now log in!");
    router.push("/login")
  };

  // If user is pending verification, show code component
  if (pendingVerification) {
    return <VerifyVendorCode email={email} onVerified={handleVerified} />;
  }

  return (
    <div className="bg-white text-black w-full
     md:w-[500px] px-6 py-3 mx-auto my-10 mt-[-10px] ">
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
      className="space-y-4 shadow-lg rounded-lg border border-gray-200 px-6 py-8">
        <div>
          <label className="block text-sm  mb-1 font-semibold">Business Name</label>
          <input
            type="text"
            value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your business name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Contact Person Name</label>
          <input
            type="text"
            placeholder="Full name"
            value={contactPersonName}
          onChange={(e) => setContactPersonName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
          onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="+1 (XXX) XXX-XXXX"
            value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
          onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must contain at least 8 characters, including uppercase, lowercase, and a number.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
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
  disabled={loading} // Disable while loading
  className={`w-full text-[15px] font-medium py-2 rounded-md transition ${
    loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 text-white"
  }`}
>
  {loading ? "Creating Account..." : "CREATE ACCOUNT"}
</button>


        <p className="text-center text-sm text-gray-600 mt-2">
          Already have a vendor account?{" "}
          <a href="#" className="text-black underline">
            Sign In
          </a>
        </p>
      </form>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-500 mt-6">
        By joining PALMODA as a vendor, you'll reach fashion-forward customers worldwide.{" "}
        <a href="#" className="text-black underline">
          Vendor Support Team
        </a>
      </p>
    </div>
  );
}

export default Page;
