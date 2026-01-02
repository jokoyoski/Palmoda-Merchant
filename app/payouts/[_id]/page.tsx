"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { CiBank } from 'react-icons/ci';
import { FaCheckCircle, FaClock, FaHourglassHalf, FaTimesCircle, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { LuWarehouse } from "react-icons/lu";
import PayoutFailed from '../PayoutFailed';
import WithdrawalSubmitted from '../WithDrawalSubmitted';
import { useParams } from 'next/navigation';
import {PayoutType} from "../../_lib/type"
import {getTransactionById} from "../../_lib/transactions"
import { getWallet } from '@/app/_lib/vendor';
import { toast } from 'react-toastify';


const Skeleton = () => (
  <div className="w-[500px] mx-auto bg-white rounded-[6px] px-4 py-3 animate-pulse">
    
    <div className="h-4 w-40 bg-gray-200 rounded mb-6"></div>

    <div className="flex flex-col justify-center text-center my-4">
      <div className="h-3 w-24 bg-gray-200 rounded mx-auto mb-2"></div>
      <div className="h-6 w-32 bg-gray-300 rounded mx-auto"></div>
    </div>

    {/* Amount breakdown */}
    <div className="my-4 flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
        <div className="h-3 w-10 bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
        <div className="h-3 w-10 bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-28 bg-gray-200 rounded"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-32 bg-gray-200 rounded"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>

    <hr className="text-gray-200 my-4" />

    {/* Status timeline */}
    <div className="my-4 flex flex-col gap-3">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>

      <div className="flex flex-col gap-6 border-l-2 border-gray-200 pl-4">
        <div className="flex items-start gap-3 relative">
          <div className="h-5 w-5 bg-gray-300 rounded-full absolute -left-6"></div>
          <div>
            <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-40 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Payout account */}
    <div className="bg-gray-100 px-3 py-1.5 rounded-[6px]">
      <div className="h-4 w-28 bg-gray-200 rounded mb-2"></div>

      <div className="flex items-center gap-1.5">
        <div className="bg-gray-300 rounded-[5px] p-3"></div>
        <div>
          <div className="h-3 w-40 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 w-28 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>

    {/* Tips */}
    <div className="bg-gray-300 px-3 my-4 py-1.5 rounded-[6px]">
      <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>

      <div className="flex gap-1.5 my-3">
        <div className="h-5 w-5 bg-gray-400 rounded"></div>
        <div>
          <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 w-48 bg-gray-100 rounded"></div>
        </div>
      </div>

      <div className="flex gap-1.5 my-3">
        <div className="h-5 w-5 bg-gray-400 rounded"></div>
        <div>
          <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 w-48 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>

    <div className="flex justify-between my-3">
      <div className="h-8 w-28 bg-gray-300 rounded"></div>
      <div className="h-8 w-32 bg-gray-300 rounded"></div>
    </div>

  </div>
);


// Map status → icon, color, message
const getStatusDisplay = (status: string) => {
  const statusLower = status?.toLowerCase();

  if (statusLower?.startsWith("success")) {
    return {
      icon: <FaCheckCircle className="text-green-500 text-lg absolute -left-6" />,
      label: "Successful",
      message: "Your payout has been successfully processed.",
      color: "text-green-500"
    };
  }

  switch (statusLower) {

    case "pending":
      return {
        icon: <FaHourglassHalf className="text-yellow-500 text-lg absolute -left-6" />,
        label: "Pending",
        message: "Your payout is pending and awaiting bank confirmation.",
        color: "text-yellow-500"
      };

    case "failed":
      return {
        icon: <FaClock className="text-red-500 text-lg absolute -left-6" />,
        label: "Failed",
        message: "Your payout request failed.",
        color: "text-red-500"
      };

    default:
      return {
        icon: <FaClock className="text-gray-400 text-lg absolute -left-6" />,
        label: "Unknown",
        message: "Status not available.",
        color: "text-gray-400"
      };
  }
};


function page() {
  
    const {_id} = useParams();
     const [loading, setLoading] = useState(false);
     const [transaction, setTransaction] = useState<PayoutType | null>(null);
     const [error, setError] = useState("");
     const [bankName, setBankName] = useState("");
        const [accountHolder, setAccountHolder] = useState("");
        const [amountError, setAmountError] = useState("");
        const [accountNumber, setAccountNumber] = useState("");

    useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);

      try {
        const res = await getTransactionById(_id);
        console.log(res);

        if (res?.data) {
          setTransaction(res.data);
        } else {
          setError("No transaction found");
        }
      } catch (err) {
        setError("Failed to fetch transaction");
      }

      setLoading(false);
    };

    fetchTransaction();
  }, [_id]);

  useEffect(() => {
         const fetchWallet = async () => {
           setLoading(true);
           try {
             const res = await getWallet();
             console.log(res);
             if (res.success === false) {
              //  toast.error(res.message);
              console.log(res.message);
              
             } else {
               // Populate form fields
               setBankName(res.data.bank_name || "");
               setAccountHolder(res.data.account_holder_name || "");
               setAccountNumber(res.data.account_number || "");
             }
           } catch (err: any) {
             console.log(err?.message || "Failed to fetch KYC details");
           } finally {
             setLoading(false);
           }
         };
     
         fetchWallet();
       }, []);

       
      const last4Digits = accountNumber.slice(-4);




      if (loading) {
  return (
    <section className="bg-gray-200 min-h-screen px-4 md:px-8 py-6 w-full">
      <Skeleton />
    </section>
  );
}



  

  return (
    <section className="bg-gray-200  min-h-screen px-4 md:px-8 py-6 w-full">
      <div className='w-[500px] mx-auto bg-white rounded-[6px] px-4 py-3'>
           <h1 className='text-sm text-black font-semibold'>Transaction Details – {transaction?.transaction_reference} </h1>
           <div className='flex flex-col justify-center text-center my-4'>
              <div className='flex items-center justify-center gap-2 mb-1'>
                {transaction?.transaction_type === "credit" ? (
                  <FaArrowDown className="text-green-600 text-lg" />
                ) : (
                  <FaArrowUp className="text-red-600 text-lg" />
                )}
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  transaction?.transaction_type === "credit"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {transaction?.transaction_type === "credit" ? "Credit" : "Debit"}
                </span>
              </div>
              <p className='text-xs text-gray-500'>
                {transaction?.transaction_type === "credit" ? "Amount received" : "Amount withdrawn"}
              </p>
              <h1 className={`text-2xl font-semibold ${
                transaction?.transaction_type === "credit" ? "text-green-600" : "text-red-600"
              }`}>₦{transaction?.amount?.toLocaleString()}</h1>
           </div>
           <div className='my-4 flex flex-col gap-3'>
             <div className='flex justify-between'>
               <p className='text-gray-500 text-xs'>Transaction type</p>
               <h3 className={`text-xs font-semibold ${
                 transaction?.transaction_type === "credit" ? "text-green-600" : "text-red-600"
               }`}>
                 {transaction?.transaction_type === "credit" ? "Credit" : "Debit"}
               </h3>
             </div>
             {transaction?.narration && (
               <div className='flex justify-between'>
                 <p className='text-gray-500 text-xs'>Narration</p>
                 <h3 className='text-black text-xs text-right max-w-[60%]'>{transaction.narration}</h3>
               </div>
             )}
             <div className='flex justify-between'>
               <p className='text-gray-500 text-xs'>Transaction fee</p>
               <h3 className='text-black text-xs'>₦0</h3>
             </div>
             <div className='flex justify-between'>
               <p className='text-gray-500 text-xs'>
                 {transaction?.transaction_type === "credit" ? "You received" : "You will receive"}
               </p>
               <h3 className='text-black text-xs'>₦{transaction?.amount?.toLocaleString()}</h3>
             </div>
             <div className='flex justify-between'>
               <p className='text-gray-500 text-xs'>
                 {transaction?.transaction_type === "credit" ? "Received on" : "Requested on"}
               </p>
               <h3 className='text-black text-xs'>{transaction?.created_at}</h3>
             </div>
             {transaction?.transaction_type === "debit" && (
               <div className='flex justify-between'>
                 <p className='text-gray-500 text-xs'>Estimated settlement</p>
                 <h3 className='text-black text-xs'>Within 24 hours</h3>
               </div>
             )}
           </div>
           <hr className='text-gray-200 my-4'/>
           <div className="my-4 flex flex-col gap-3">
      <h1 className="text-sm text-black font-semibold">Status timeline</h1>

      <div className="flex flex-col gap-6 border-l-2 border-gray-200 pl-4">

        {/* Status based on transaction status */}
        {transaction?.status?.toLowerCase().startsWith("success") && (
    <div className="flex items-start gap-3 relative">
      <FaCheckCircle className="text-green-500 text-lg absolute -left-6" />
      <div>
        <p className="font-semibold text-black text-sm">Transaction Successful</p>
        <p className="text-xs text-gray-500">
          {transaction?.transaction_type === "credit"
            ? "Payment has been credited to your account."
            : "Your withdrawal has been completed successfully."}
        </p>
      </div>
    </div>
  )}

        {transaction?.status === "pending" && (
    <div className="flex items-start gap-3 relative">
      <FaHourglassHalf className="text-yellow-500 text-lg absolute -left-6" />
      <div>
        <p className="font-semibold text-black text-sm">Pending</p>
        <p className="text-xs text-gray-500">
          {transaction?.transaction_type === "credit"
            ? "Payment is being processed."
            : "Your withdrawal is awaiting confirmation from the bank."}
        </p>
      </div>
    </div>
  )}

        {transaction?.status === "failed" && (
    <div className="flex items-start gap-3 relative">
      <FaTimesCircle className="text-red-500 text-lg absolute -left-6" />
      <div>
        <p className="font-semibold text-black text-sm">Transaction Failed</p>
        <p className="text-xs text-gray-500">This transaction was not completed.</p>
      </div>
    </div>
  )}

      </div>
    </div>

          <div className='bg-gray-100 px-3 py-1.5 rounded-[6px]'>
            <h1 className='text-black text-sm font-semibold mb-2'>Account Details</h1>
            <div className='flex items-center gap-1.5'>
               <div className='bg-gray-300 rounded-[5px] p-2'>
                  <CiBank className='text-black font-semibold text-[23px]'/>
               </div>
               <div>
                <h3 className='text-xs text-black font-semibold'>
                  {accountHolder} · {bankName} · **** {last4Digits}</h3>
                <p className='text-xs text-gray-500'>Primary · Not editable</p>
               </div>
            </div>
          </div>
          
          <div className='bg-gray-300 px-3 my-4 py-1.5 rounded-[6px]'>
              <h1 className='text-sm text-black font-semibold'>Settlement Tips</h1>
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
            <Link href="/payouts/history" className='px-4 py-2 border text-xs
             border-gray-500 rounded-[6px] text-gray-500'>
              Back to Transactions
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
