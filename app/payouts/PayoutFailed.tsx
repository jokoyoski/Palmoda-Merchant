"use client";
import Link from "next/link";
import { CiBank, CiWarning } from "react-icons/ci";
import { FaExclamationCircle } from "react-icons/fa";
import { FaCircle, FaShield, FaWifi } from "react-icons/fa6";

export default function PayoutFailed() {
  return (
      <section className="flex gap-2 bg-gray-200  min-h-screen px-4 md:px-8 py-6">
         <section className="bg-white p-6 rounded-md border border-gray-200 w-full">
      {/* Header Icon */}
      <div className="flex flex-col items-center gap-2">
        <FaExclamationCircle className="text-red-600 text-4xl" />

        <h1 className="text-xl font-semibold text-red-600">Payout Failed</h1>
        <p className="text-gray-600 text-sm text-center">
          Your withdrawal could not be processed. Please review the details below.
        </p>
      </div>

      {/* Transaction Details */}
      <div className="mt-6 border border-gray-200 rounded-md p-4 bg-gray-50">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Amount Attempted</span>
          <span className="font-semibold text-black">$6,842.00</span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Payout Account</span>
          <span className="font-semibold text-black">First National Bank •••• 3948</span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Reference ID</span>
          <span className="font-semibold text-black">PM-WD-872391</span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Date Attempted</span>
          <span className="font-semibold text-black">May 14, 2025 • 10:42 AM</span>
        </div>

        <div className="flex justify-between items-start mt-3">
          <span className="text-gray-600 text-sm">Failure Reason</span>

          <span className="text-red-600 text-sm flex items-center gap-1 font-medium">
            <FaCircle className="text-red-500 text-[8px]" />
            Bank rejected transaction
          </span>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md text-sm">
        <h2 className="font-semibold text-gray-700 mb-3">Troubleshooting Tips</h2>

        <ul className="space-y-2 text-gray-600">
          <li className="flex gap-2 items-start">
            <FaCircle className="text-gray-500 text-[7px]" />
            Verify that your payout account is active.
          </li>
          <li className="flex gap-2 items-start">
            <FaCircle className="text-gray-500 text-[7px]" />
            Check your available balance and fees.
          </li>
          <li className="flex gap-2 items-start">
            <FaCircle className="text-gray-500 text-[7px]" />
            Try again after a few minutes.
          </li>
          <li className="flex gap-2 items-start">
            <FaCircle className="text-gray-500 text-[7px]" />
            Contact Palmoda Support if the issue persists.
          </li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-3">
        <button className="px-4 py-2 text-xs border text-black rounded-md hover:bg-gray-100">
          Try Again
        </button>

        <button className="px-4 py-2 text-xs bg-black text-white rounded-md">
          Contact Support
        </button>
      </div>
    </section>
    <div className="w-[40%] bg-white h-fit rounded-[6px] px-4 py-3">
      <h1 className="text-black font-semibold text-sm">Why payouts fail</h1>
      <div className="flex flex-col gap-3 my-3.5">
       <div>
         <div className="flex gap-1 items-center">
           <CiBank className="text-xs text-black font-semibold"/>
           <h3 className="text-xs text-black font-semibold">Bank Declines</h3>
         </div>
         <p className="text-xs text-gray-500 my-1">Your bank may reject transactions due to suspicious activity flags or account restrictions.</p>
       </div>
       <div>
         <div className="flex gap-1 items-center">
           <FaShield className="text-xs text-black font-semibold"/>
           <h3 className="text-xs text-black font-semibold">Compliance Holds</h3>
         </div>
         <p className="text-xs text-gray-500 my-1">Occasional reviews ensure platform security and may temporarily delay payouts.</p>
       </div>
       <div>
         <div className="flex gap-1 items-center">
           <FaWifi className="text-xs text-black font-semibold"/>
           <h3 className="text-xs text-black font-semibold">Network Downtime</h3>
         </div>
         <p className="text-xs text-gray-500 my-1">Banking networks experience occasional maintenance or technical issues.</p>
       </div>

       <div>
         <div className="flex gap-1 items-center">
           <CiWarning className="text-xs text-black font-semibold"/>
           <h3 className="text-xs text-black font-semibold">Invalid Routing</h3>
         </div>
         <p className="text-xs text-gray-500 my-1">Incorrect account details can prevent funds from reaching your account.</p>
       </div>
        
      </div>
      <Link href="/payouts/history" className="text-center bg-inherit border border-gray-200 text-xs px-4 py-2 mx-auto">View Transaction History</Link>
    </div>
      </section>
  );
}
