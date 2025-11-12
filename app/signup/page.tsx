import Link from "next/link";
import React from "react";

function Page() {
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
      <form className="space-y-4 shadow-lg rounded-lg border border-gray-200 px-6 py-8">
        <div>
          <label className="block text-sm  mb-1 font-semibold">Business Name</label>
          <input
            type="text"
            placeholder="Your business name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Contact Person Name</label>
          <input
            type="text"
            placeholder="Full name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="+1 (XXX) XXX-XXXX"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            placeholder="Minimum 8 characters"
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
          className="w-full bg-black text-white
          text-[15px]
           font-medium py-2 rounded-md hover:bg-gray-800 transition"
        >
          CREATE ACCOUNT
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
