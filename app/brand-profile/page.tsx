import React from 'react'
import { FaFacebook, FaFileUpload, FaInstagram, FaPinterest, FaTiktok, FaTwitter } from 'react-icons/fa'
import { RiPlanetFill } from "react-icons/ri";
import { BiSolidInfoCircle } from "react-icons/bi";

function page() {
  return (
    <section className='bg-white min-h-screen px-4  md:px-8 py-6 w-full'>
      <div className='w-full md:w-[600px] lg:w-[750px] '>
        <h1 className='text-black font-semibold text-xl'>Brand Profile Setup</h1>
        <p className='text-gray-500 text-[13px] mt-2 mb-5'>
            Create your brand's presence on PALMODA. This information will be visible to customers.
        </p>

        <hr className='text-gray-200 mb-3.5' />

        <div className='flex w-full my-2 flex-col gap-1.5'>
         <label htmlFor="brand name" className='text-black font-semibold text-xs'>Brand Name*</label>
         <input type="text" name="" id="" className='p-[5px] text-black border border-gray-200 text-xs' placeholder='Enter brand name' />
        </div>
        <div className='flex w-full my-2 flex-col gap-1.5'>
  <label htmlFor="brand-description" className='text-black font-semibold text-xs'>
    Brand Description/Bio*
  </label>
  <textarea
    id="brand-description"
    name="brand-description"
    placeholder='Tell us about your brand, philosophy, and what makes you unique'
    className='w-full p-3 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none h-32'
  />
  <p className='text-xs text-gray-500 mb-5'>
    Minimum 100 characters, maximum 500 characters
  </p>
</div>

 <hr className='text-gray-200 my-5' />

{/* Brand Logos & Banner Section */}
<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
  {/* Brand Logo Black Version */}
  <div className='flex flex-col gap-2'>
    <label className='text-black font-semibold text-xs'>Brand Logo (Black Version)*</label>
    <div className='border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center h-32 cursor-pointer hover:bg-gray-50 transition'>
      <FaFileUpload className='text-gray-300 mb-2' />
      <p className='text-gray-500 text-xs mb-1'>Drag & drop your logo here</p>
      <button className='bg-black text-white text-xs px-3 py-1 rounded-sm'>
        Upload File
      </button>
      <p className='text-gray-400 text-[10px] mt-1'>JPG or PNG, 500x500 minimum</p>
    </div>
  </div>

  {/* Brand Logo White Version */}
  <div className='flex flex-col gap-2'>
    <label className='text-black font-semibold text-xs'>Brand Logo (White Version)*</label>
    <div className='border-2 border-dashed border-gray-300
     bg-gray-900 rounded-md flex flex-col items-center justify-center
      h-32 cursor-pointer transition'>
        <FaFileUpload className='text-gray-300 mb-2' />
      <p className='text-white text-xs mb-1'>Drag & drop your logo here</p>
      <button className='bg-white text-black text-xs px-3 py-1 rounded-sm'>
        Upload File
      </button>
      <p className='text-gray-400 text-[10px] mt-1'>JPG or PNG, 500x500 minimum</p>
    </div>
  </div>
</div>

{/* Brand Banner / Hero Image */}
<div className='mt-4 flex flex-col gap-2'>
  <label className='text-black font-semibold text-xs'>Brand Banner (Hero Image)*</label>
  <div className='border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-gray-50 transition'>
    <FaFileUpload className='text-gray-300 mb-2' />
    <p className='text-gray-500 text-xs mb-1'>Drag & drop your banner image here</p>
    <button className='bg-black text-white text-xs px-3 py-1 rounded-sm'>
      Upload File
    </button>
    <p className='text-gray-400 text-[10px] mt-1 text-center'>
      JPG or PNG, 1140x480 recommended
    </p>
  </div>
  <p className='text-xs text-gray-500'>
    This image will appear at the top of your brand page and should represent your brand’s aesthetic.
  </p>
</div>

<hr className='text-gray-200 my-5' />


          <hr className='text-gray-200 mb-3.5' />
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
           <div className='flex flex-col gap-1.5 w-full'>
  <label htmlFor="instagram" className='text-black font-semibold text-xs'>
    Instagram
  </label>
  <div className="relative w-full">
    <FaInstagram className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      id="instagram"
      placeholder='@yourbrandname'
      className='pl-8 text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0 w-full'
    />
  </div>
</div>

<div className='flex flex-col gap-1.5 w-full'>
  <label htmlFor="facebook" className='text-black font-semibold text-xs'>
    Facebook
  </label>
  <div className="relative w-full">
    <FaFacebook className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      id="facebook"
      placeholder='facebook.com/yourbrandname'
      className='pl-8 text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0 w-full'
    />
  </div>
</div>

<div className='flex flex-col gap-1.5 w-full'>
  <label htmlFor="Twitter" className='text-black font-semibold text-xs'>
    Twitter
  </label>
  <div className="relative w-full">
    <FaTwitter className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      id="twitter"
      placeholder='@yourbrandname'
      className='pl-8 text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0 w-full'
    />
  </div>
</div>

<div className='flex flex-col gap-1.5 w-full'>
  <label htmlFor="pintrest" className='text-black font-semibold text-xs'>
    Pintrest
  </label>
  <div className="relative w-full">
    <FaPinterest className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      id="pintrest"
      placeholder='pintrest.com/yourbrandname'
      className='pl-8 text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0 w-full'
    />
  </div>
</div>

<div className='flex flex-col gap-1.5 w-full'>
  <label htmlFor="tiktok" className='text-black font-semibold text-xs'>
    Tiktok
  </label>
  <div className="relative w-full">
    <FaTiktok className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      id="Tiktok"
      placeholder='@yourbrandname'
      className='pl-8 text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0 w-full'
    />
  </div>
</div>

<div className='flex flex-col gap-1.5 w-full'>
  <label htmlFor="website" className='text-black font-semibold text-xs'>
    Website
  </label>
  <div className="relative w-full">
    <RiPlanetFill className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      id="Website"
      placeholder='https://yourbrand.com'
      className='pl-8 text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0 w-full'
    />
  </div>
</div>

          </div>
          <hr className='text-gray-200 my-5'/>
          <div className='flex my-3 justify-between items-center'>
        <button
        className='bg-inherit border border-black text-black p-[5px] w-[120px] text-sm'
        >Save as Draft</button>
        <div className='flex items-center gap-2'>
             <button
        className='bg-inherit border border-black text-black p-[5px] w-[120px] text-sm'
        >Back</button>
        <button
        className='bg-black  text-white p-[5px] w-[120px] text-sm'
        >Continue</button>
        </div>
        </div>
         
         <hr className='text-gray-200 my-5'/>
          
        <div className='flex my-3 justify-between items-center'>
           <div className='flex items-start gap-1 text-xs text-gray-500'>
           <BiSolidInfoCircle />
           <p>Need help setting up your brand profile?  View our guide</p>
           </div>

           <p className='text-black font-semibold text-sm'>Skip for now</p>
        </div>

        </div>
    </section>
  )
}

export default page
