"use client";
import Link from 'next/link'
import React from 'react'
import ProtectedRoute from '../_components/ProtectedRoute'

function page() {
  return (
    <ProtectedRoute>
      <section className='bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full'>
      <div className='flex justify-between items-center'>
       <div>
        <h1 className='text-black font-semibold text-lg'>Withdraw Funds</h1>
        <p className='text-xs text-gray-500'>Transfer your available balance to your registered bank account.</p>
       </div>
       <div className='bg-white px-3 py-1 rounded-[6px]'>
        <p className='text-xs text-gray-500'>Available Balance</p>
        <h1 className='text-black font-semibold text-lg'>$6,842.00</h1>
        <p className='text-xs text-gray-500'>Next settlement: Today    Minimum withdrawal: $50</p>
       </div>
      </div>



      <div className='flex gap-3 items-start mt-6 '>
       <div className='w-full '>
          <div className='bg-white px-4 my-2 rounded-[6px] py-2'>
             <h1 className='text-black font-semibold'>Payout Account</h1>
             <div className='bg-gray-200 px-3 flex justify-between py-1 rounded-[6px] mt-3'>
               <div>
                <h1 className='text-gray-900 text-sm'>First National Bank</h1>
                <p className='text-gray-700 text-xs'>Laurent Fashion House</p>
                <p className='text-gray-500 text-xs'>Account ending in •••• 4587</p>
               </div>
               <p className='text-purple-500 text-xs'>Primary · Locked</p>
             </div>
             <p className='text-gray-500 my-2 text-xs'>Payout account can only be updated by Palmoda admin. Contact support to make changes.</p>
          </div>

          <div className='bg-white px-4 my-4 rounded-[6px] py-2'>
             <h1 className='text-black font-semibold'>Withdrawal Details</h1>
             <div className='flex gap-1 my-2 flex-col'>
              <label className='text-gray-500 text-xs' htmlFor="">Amount to withdraw</label>
               <input type="number" name="" id=""  className='text-gray-500 border border-gray-600 p-2 rounded-[5px] text-xs'/>
             </div>

               <div className='flex gap-3 my-2.5'>
                <p className='text-gray-900 p-2 rounded-[5px] bg-gray-200 text-xs'>WithDraw Full Balance</p>
                <p className='text-gray-900 p-2 rounded-[5px] bg-gray-200 text-xs'>Withdraw 50% of Balance</p>
                <p className='text-gray-900 p-2 rounded-[5px] bg-gray-200 text-xs'>Custom</p>
               </div>
            <div className='bg-gray-200 px-2 py-1 mb-3 rounded-[5px]'>
               <div className='flex justify-between items-center'>
                 <p className='text-gray-500 text-xs'>Available balance:</p>
                 <h1 className=' text-black text-sm font-semibold'>$6,842.00</h1>
               </div>
               <div className='flex justify-between items-center'>
                <p className='text-gray-500 text-xs'>Transaction fee:</p>
                 <h1 className=' text-black text-sm font-semibold'>$6</h1>
               </div>
               <hr className='my-2 text-gray-500'/>
               <div className='flex justify-between items-center'>
                <p className='text-black text-xs'>You will receive:</p>
                 <h1 className=' text-black text-sm font-semibold'>$6,837.00</h1>
               </div>
            </div>
          </div>
          <div className='bg-white mb-4 px-4 my-4 rounded-[6px] py-2'>
            <h1 className='text-black font-semibold'>Notes (optional)</h1>
            <textarea name="" id="" className='px-4 py-2 text-gray-500 border w-full my-4 border-gray-200'></textarea>
          </div>
          <div className='flex items-center justify-end gap-3'>
           <button className='bg-inherit text-black text-xs'>Cancel</button>
           <button className='bg-gray-300 text-gray-900 p-2 text-xs rounded-[5px]'>Confirm Withdrawal</button>
          </div>
       </div>

      <div className='w-[30%] bg-white px-4 my-4 rounded-[6px] py-2 h-fit'>
       <h1 className='text-black font-semibold'>Recent Payouts</h1>
       <div className='my-2 border-b border-gray-200 px-3 flex justify-between py-1'>
         <div>
          <h1 className='text-black text-sm font-semibold'>$3,500.00</h1>
          <p className='text-gray-500 text-xs'>October 15, 2023</p>
          <p className='text-gray-500 text-xs'>Ref: PAY-78952</p>
         </div>
         <p className='text-green-500 text-xs'>Completed</p>
       </div>
       <div className='my-2 border-b border-gray-200 px-3 flex justify-between py-1'>
         <div>
          <h1 className='text-black text-sm font-semibold'>$3,500.00</h1>
          <p className='text-gray-500 text-xs'>October 15, 2023</p>
          <p className='text-gray-500 text-xs'>Ref: PAY-78952</p>
         </div>
         <p className='text-green-500 text-xs'>Completed</p>
       </div>
       <div className='my-2 border-b border-gray-200 px-3 flex justify-between py-1'>
         <div>
          <h1 className='text-black text-sm font-semibold'>$3,500.00</h1>
          <p className='text-gray-500 text-xs'>October 15, 2023</p>
          <p className='text-gray-500 text-xs'>Ref: PAY-78952</p>
         </div>
         <p className='text-green-500 text-xs'>Completed</p>
       </div>

      <Link href="/payouts/history" className='text-blue-400 text-xs underline text-center my-2'>History</Link>
      </div>


      </div>
    </section>
    </ProtectedRoute>
  )
}

export default page
