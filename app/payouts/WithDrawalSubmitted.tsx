"use client";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircle, FaClock, FaHourglassHalf } from "react-icons/fa6";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { IoMdInformationCircle } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import Link from "next/link";

export default function WithdrawalSubmitted() {
  return (
   <section className="flex gap-2 bg-gray-200  min-h-screen px-4 md:px-8 py-6">
     <section className="bg-white p-6 border h-fit border-gray-200 rounded-md w-full">
      {/* Header Icon */}
      <div className="flex flex-col items-center gap-2">
        <FaCheckCircle className="text-green-600 text-4xl" />

        <h1 className="text-xl font-semibold text-black text-center">
          Withdrawal Request Submitted
        </h1>

        <p className="text-gray-600 text-sm text-center">
          Your payout is being processed. Funds will arrive in your account shortly.
        </p>
      </div>

      {/* Transaction details */}
      <div className="mt-6 border border-gray-200 rounded-md p-4 bg-gray-50">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Amount withdrawn</span>
          <span className="font-semibold text-black">$6,837.00</span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Transaction fee</span>
          <span className="font-semibold text-black">$5.00</span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">To account</span>
          <span className="font-semibold text-black">
            Laurent Fashion House • First National Bank •••• 3948
          </span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Requested on</span>
          <span className="font-semibold text-black">May 14, 2025 • 10:42 AM</span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Reference ID</span>
          <span className="font-semibold text-black">PM-WD-872391</span>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Estimated settlement</span>
          <span className="font-semibold text-black">
            Within 24 hours (business days only)
          </span>
        </div>
      </div>

      {/* Status timeline */}
      <div className="flex justify-center mt-8 gap-10">
        {/* Request Received */}
        <div className="flex flex-col items-center">
          <FaCheckCircle className="text-green-600 text-3xl" />
          <p className="text-sm text-gray-700 mt-1">Request received</p>
        </div>

        {/* Processing */}
        <div className="flex flex-col items-center">
          <FaHourglassHalf className="text-yellow-500 text-3xl" />
          <p className="text-sm text-gray-700 mt-1">Processing</p>
        </div>

        {/* Settled (inactive gray circle) */}
        <div className="flex flex-col items-center">
          <FaCircle className="text-gray-400 text-3xl" />
          <p className="text-sm text-gray-700 mt-1">Funds settled</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center mt-6">
        <Link href="/payouts/payout-detail" className="px-4 py-2 bg-gray-200 text-black text-xs rounded-md">
          View Transaction Details
        </Link>

        <Link href="/" className="px-4 py-2 border text-black text-xs
         rounded-md hover:bg-gray-100">
          Back to Dashboard
        </Link>
      </div>
    </section>
    <div className="w-[40%] bg-white h-fit rounded-[6px] px-4 py-3">
        <h1 className="text-black font-semibold text-sm">Payout tips</h1>
        <div className="flex flex-col gap-3 my-3.5">
            <div className="flex gap-1">
                       <FaClock className="text-lg text-black font-semibold"/>
                       <div>
                        <h3 className="text-xs text-black font-semibold">Bank Declines</h3>
                        <p className="text-gray-500 text-xs">Most payouts settle within 24 hours during business days. Weekend requests process on Monday.</p>
                       </div>
                     </div>
            <div className="flex gap-1">
                       <SlCalender className="text-lg text-black font-semibold"/>
                       <div>
                        <h3 className="text-xs text-black font-semibold">Holiday schedules</h3>
                        <p className="text-gray-500 text-xs">Bank holidays may delay settlement. Check our holiday processing calendar for details.</p>
                       </div>
                     </div>
            <div className="flex gap-1">
                       <TfiHeadphoneAlt className="text-lg text-black font-semibold"/>
                       <div>
                        <h3 className="text-xs text-black font-semibold">Need help?</h3>
                        <p className="text-gray-500 text-xs">Contact our vendor support team at  <span className="text-black font-semibold">support@palmoda.com</span>  or call 1-800-PALMODA.</p>
                       </div>
                     </div>                  
        </div>
        <div className="my-3 bg-gray-400 text-gray-800 rounded-[6px] px-3 py-2 flex">
           <IoMdInformationCircle className="text-[23px]" />
            <div>
                <h4 className="text-xs">Faster payouts</h4>
                <p className="text-xs text-gray-500">Upgrade to Premium Vendor status for same-day payouts and reduced fees.</p>
            </div>
        </div>
    </div>
   </section>
  );
}
