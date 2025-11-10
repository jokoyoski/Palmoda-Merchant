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
        <section className='flex flex-wrap items-center gap-5'>
         {/* begining of business reg doc */}
          <div className='flex flex-col gap-1 w-full md:w-[210px]'>
            <h1 className='text-black font-semibold text-xs'>Business Registration Document</h1>
            <div className='border-2 p-4 border-gray-300 h-[180px] border-dashed flex flex-col justify-center items-center'>
           <FaFileUpload className='text-gray-300 mb-2' />
           <p className='text-gray-500 mb-2 text-xs' >click to upload</p>
           <p className='text-gray-500 mb-2 text-[10px] text-center'>Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
           <button className='bg-black text-white p-[5px] text-xs'>
            Upload Document
           </button>
          </div>
         </div>
         {/* ending of business reg doc */}
         {/* begining of owner id  */}
         <div className='flex flex-col gap-1 w-full md:w-[230px]'>
          <h1 className='text-black font-semibold text-[9px]'>Valid Owner ID (Passport/National ID/Drivers License) *</h1> 
          <div className='border-2 p-4 border-gray-300 h-[180px] border-dashed flex flex-col justify-center items-center'>
           <FaFileUpload className='text-gray-300 mb-2' />
           <p className='text-gray-500 mb-2 text-xs' >click to upload</p>
           <p className='text-gray-500 mb-2 text-[10px] text-center'>Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
           <button className='bg-black text-white p-[5px] text-xs'>
            Upload Document
           </button>
          </div>
         </div>
         {/* ending of owner id */}
        {/* begining of bank statement */}
        <div className='flex flex-col gap-1 w-full md:w-[230px]'>
          <h1 className='text-black font-semibold text-xs'>Bank Statement *</h1> 
          <div className='border-2 p-4 border-gray-300 h-[180px] border-dashed flex flex-col justify-center items-center'>
           <FaFileUpload className='text-gray-300 mb-2' />
           <p className='text-gray-500 mb-2 text-xs' >click to upload</p>
           <p className='text-gray-500 mb-2 text-[10px] text-center'>Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
           <button className='bg-black text-white p-[5px] text-xs'>
            Upload Document
           </button>
          </div>
         </div>
         {/* ending of bank statement */}
        </section>
        {/* end of documents upload div */}
        <hr className='text-gray-200 mt-2 mb-4'/>
        {/* begining of business details 1 */}
        <section className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
          <div className='flex flex-col gap-1.5 w-full'>
             <label htmlFor="Business Name" className='text-black font-semibold text-xs'>Business Name *</label>
             <input type="text" name="" id="" placeholder='Enter Legal Business Name' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
          </div>
          <div className='flex flex-col gap-1.5 w-full'>
             <label htmlFor="Business Type" className='text-black font-semibold text-xs'>Business Type  *</label>
            <select name="business Type" id="" className='text-black p-1 text-sm border border-gray-300'>
              <option value="">Select Business Type</option>
              <option value="">Fashion Brand / Designer</option>
              <option value="">Boutique / Store</option>
              <option value="">Online Thrift Seller</option>
              <option value="">Accessories Brand</option>   
              <option value="">Footwear Retailer</option>           
              </select>
            </div>
            <div className='flex flex-col gap-1.5 w-full'>
             <label htmlFor="Registration Number" className='text-black font-semibold text-xs'>Registration Number *</label>
             <input type="number" name="" id="" placeholder='Enter Business Registration Number' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
          </div>
          <div className='flex flex-col gap-1.5 w-full'>
             <label htmlFor="Tax ID" className='text-black font-semibold text-xs'>Tax ID (optional) *</label>
             <input type="number" name="" id="" placeholder='Enter tax identification number' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
          </div>
        </section>
        <hr className='text-gray-200 my-4'/>
        {/* end of business details 1 */}
        {/* start of business details 2 */}
        <section className='grid grid-cols-1 md:grid-cols-2 gap-2.5'>
         <div className='flex flex-col gap-1.5 w-full'>
          <label htmlFor="Address 1" className='text-black font-semibold text-xs'>Address Line 1 *</label>
          <input type="text" name="" id="" placeholder='Street Address' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
         </div>
         <div className='flex flex-col gap-1.5 w-full'>
          <label htmlFor="Address 2" className='text-black font-semibold text-xs'>Address Line 2 </label>
          <input type="text" name="" id="" placeholder='Apt, suite, unit, etc (optional)' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
         </div>
         <div className='flex flex-col gap-1.5 w-full'>
          <label htmlFor="City" className='text-black font-semibold text-xs'>City *</label>
          <input type="text" name="" id="" placeholder='Enter city' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
         </div>
         <div className='flex flex-col gap-1.5 w-full'>
          <label htmlFor="State" className='text-black font-semibold text-xs'>State/Province *</label>
          <input type="text" name="" id="" placeholder='Enter state' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
         </div>
         <div className='flex flex-col gap-1.5 w-full'>
          <label htmlFor="postal code" className='text-black font-semibold text-xs'>Postal Code *</label>
          <input type="number" name="" id="" placeholder='Enter postal code' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
         </div>
         <div className='flex flex-col gap-1.5 w-full'>
          <label htmlFor="Country" className='text-black font-semibold text-xs'>Country *</label>
          <input type="text" name="" id="" placeholder='Enter Country' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
         </div>
         <div className='flex flex-col gap-1.5 w-full'>
          <label htmlFor="bank name" className='text-black font-semibold text-xs'>Bank Name *</label>
          <input type="text" name="" id="" placeholder='Enter bank name' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
         </div>
         <div className='flex flex-col gap-1.5 w-full'>
          <label htmlFor="bank holder name" className='text-black font-semibold text-xs'>Account Holder Name *</label>
          <input type="text" name="" id="" placeholder="Enter account holder's name" className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
         </div>
          <div className='flex flex-col gap-1.5 w-full'>
          <label htmlFor="postal code" className='text-black font-semibold text-xs'>Account Number *</label>
          <input type="number" name="" id="" placeholder='Enter bank account number' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
         </div>
        </section>
        {/* end of business details 2 */}
        <hr  className='text-gray-200 my-2'/>
        <div className='flex items-center gap-1.5 my-3.5'>
         <input type="checkbox" name="" id="" />
         <label htmlFor="" className='text-xs text-gray-500'>I certify that all information provided is accurate and complete. I understand that providing false information may result in rejection of my vendor application.</label>
        </div>

        <div className='flex justify-between items-center'>
        <button
        className='bg-inherit border border-black text-black p-[5px] w-[120px] text-sm'
        >Back</button>
        <button
        className='bg-black  text-white p-[5px] w-[120px] text-sm'
        >Continue</button>
        </div>
        </div>
      </div>
      
    </section>
  )
}

export default page
