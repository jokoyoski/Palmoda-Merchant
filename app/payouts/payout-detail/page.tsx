"use client";
import Link from 'next/link';
import React, { useState } from 'react'
import { CiBank } from 'react-icons/ci';
import { FaCheckCircle, FaClock, FaHourglassHalf } from "react-icons/fa";
import { LuWarehouse } from "react-icons/lu";
import PayoutFailed from '../PayoutFailed';
import WithdrawalSubmitted from '../WithDrawalSubmitted';

function page() {
  
    
  

  return (
    <section className="bg-gray-200  min-h-screen px-4 md:px-8 py-6 w-full">
      <div className='w-[500px] mx-auto bg-white rounded-[6px] px-4 py-3'>
           <h1 className='text-sm text-black font-semibold'>Payout Details – PM-WD-872391</h1>
           <div className='flex flex-col justify-center text-center my-4'>
              <p className='text-xs text-gray-500'>Amount withdrawn</p>
              <h1 className='text-2xl text-black font-semibold'>$6,837.00</h1>
           </div>
           <div className='my-4 flex flex-col gap-3'>
             <div className='flex justify-between'>
               <p className='text-gray-500 text-xs'>Transaction fee</p>
               <h3 className='text-black text-xs'>$5.00</h3>
             </div>
               <div className='flex justify-between'>
               <p className='text-gray-500 text-xs'>You will receive</p>
               <h3 className='text-black text-xs'>$6,837.00</h3>
             </div>
             <div className='flex justify-between'>
               <p className='text-gray-500 text-xs'>Requested on</p>
               <h3 className='text-black text-xs'>May 14, 2025 • 10:42 AM</h3>
             </div>
             <div className='flex justify-between'>
               <p className='text-gray-500 text-xs'>Estimated settlement</p>
               <h3 className='text-black text-xs'>Within 24 hours</h3>
             </div>
           </div>
           <hr className='text-gray-200 my-4'/>
           <div className="my-4 flex flex-col gap-3">
      <h1 className="text-sm text-black font-semibold">Status timeline</h1>

      <div className="flex flex-col gap-6 border-l-2 border-gray-200 pl-4">

        {/* Request Received */}
        <div className="flex items-start gap-3 relative">
          <FaCheckCircle className="text-green-500 text-lg absolute -left-6" />
          <div>
            <p className="font-semibold text-black text-sm">Request Received</p>
            <p className="text-xs text-gray-500">Your payout request has been submitted.</p>
          </div>
        </div>

        {/* Processing by Bank */}
        <div className="flex items-start gap-3 relative">
          <FaClock className="text-blue-500 text-lg absolute -left-6" />
          <div>
            <p className="font-semibold text-black text-sm">Processing by Bank</p>
            <p className="text-xs text-gray-500">The bank is currently reviewing your transaction.</p>
          </div>
        </div>

        {/* Pending */}
        <div className="flex items-start gap-3 relative">
          <FaHourglassHalf className="text-yellow-500 text-lg absolute -left-6" />
          <div>
            <p className="font-semibold text-black text-sm">Pending</p>
            <p className="text-xs text-gray-500">Awaiting confirmation from the bank.</p>
          </div>
        </div>

      </div>
    </div>

          <div className='bg-gray-100 px-3 py-1.5 rounded-[6px]'>
            <h1 className='text-black text-sm font-semibold mb-2'>Payout account</h1>
            <div className='flex items-center gap-1.5'>
               <div className='bg-gray-300 rounded-[5px] p-2'>
                  <CiBank className='text-black font-semibold text-[23px]'/>
               </div>
               <div>
                <h3 className='text-xs text-black font-semibold'>Laurent Fashion House · First National Bank · **** 4587</h3>
                <p className='text-xs text-gray-500'>Primary · Not editable</p>
               </div>
            </div>
          </div>
          
          <div className='bg-gray-300 px-3 my-4 py-1.5 rounded-[6px]'>
              <h1 className='text-sm text-black font-semibold'>Payout tips</h1>
              <div className='my-3 flex gap-1.5'>
                <LuWarehouse className='text-gray-800 text-[20px]'/>
                <div>
                  <h2 className='text-xs text-gray-800 font-semibold'>Holiday schedules</h2>
                  <p className='text-xs text-gray-500'>Bank holidays may delay settlement. Check our holiday processing calendar for details.</p>
                </div>
              </div>
              <div className='my-3 flex gap-1.5'>
                <FaClock className='text-gray-800 text-[20px]'/>
                <div>
                  <h2 className='text-xs text-gray-800 font-semibold'>Settlement times</h2>
                  <p className='text-xs text-gray-500'>Most payouts settle within 24 hours during business days. Weekend requests process on Monday.</p>
                </div>
              </div>
          </div>
          <div className='flex justify-between my-3'>
            <Link href="/payouts" className='px-4 py-2 border text-xs
             border-gray-500 rounded-[6px] text-gray-500'>
              Back to Payouts
            </Link>
            <button className='bg-gray-400 px-4 py-2 rounded-[6px] text-gray-800 text-xs'>
              Download Reciepts
            </button>
          </div>
      </div>
    </section>
  )
}

export default page
