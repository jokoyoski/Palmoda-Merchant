import React from 'react'
import { FaFileUpload } from "react-icons/fa";

function page() {
  return (
    <section className='bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full'>
      <div className='w-full md:w-[600px] lg:w-[750px] '>
        <h1 className='text-black font-semibold text-xl'>KYC Compliance</h1>
        <p className='text-gray-500 text-[13px] my-2'>Complete the following requirements to verify your business and start selling on PALMODA</p>
     <div className='border-2 border-gray-200 bg-white mt-5 p-4'>
        <div className='flex justify-between mb-8 gap-2'>
          <div>
            <h2 className='text-black font-semibold text-[14px]'>Business Verification</h2>
            <p className='text-gray-500 text-xs'>All fields marked with * are required</p>
          </div>
          {/* a black dot and a text */}
          <div className='flex items-center gap-2'>
            <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
            <p className='text-black text-[13px]'>Step 2 out of 3</p>
          </div>
        </div>
        <hr className='text-gray-200  mb-2'/>
        {/* documents upload div */}
        <div className='flex flex-wrap items-center gap-2'>
         {/* begining of business reg doc */}
         <div className='flex flex-col gap-1 w-full md:w-[210px]'>
          <h1 className='text-black font-semibold text-xs'>Business Registration Document *</h1> 
          <div className='border-2 p-4 border-gray-300 border-dashed flex flex-col justify-center items-center'>
           <FaFileUpload className='text-gray-300 mb-2' />
           <p className='text-gray-500 mb-2 text-xs' >click to upload</p>
           <p className='text-gray-500 mb-2 text-[10px] text-center'>Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
           <button className='bg-black text-white p-[5px] text-xs'>
            Upload Document
           </button>
          </div>
         </div>
         {/* ending of business reg doc */}
         {/*  */}
         <div className='flex flex-col gap-1 w-full md:w-[210px]'>
          <h1 className='text-black font-semibold text-xs'>Business Registration Document *</h1> 
          <div className='border-2 p-4 border-gray-300 border-dashed flex flex-col justify-center items-center'>
           <FaFileUpload className='text-gray-300 mb-2' />
           <p className='text-gray-500 mb-2 text-xs' >click to upload</p>
           <p className='text-gray-500 mb-2 text-[10px] text-center'>Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
           <button className='bg-black text-white p-[5px] text-xs'>
            Upload Document
           </button>
          </div>
         </div>
        </div>
        </div>
      </div>
      
    </section>
  )
}

export default page
