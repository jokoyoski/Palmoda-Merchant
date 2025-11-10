import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <section className='bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full'>
         <div className='w-full md:w-[600px] lg:w-[750px] '>
            <div className='flex justify-between'>
             <div>
                <h1 className='text-black font-semibold text-xl'>Product Catalog Upload</h1>
        <p className='text-gray-500 text-[13px] my-2'>Add new products to your inventory with detailed information</p>
             </div>
             <Link href="/">
             <button
        className='bg-black  text-white p-[5px] w-fit text-xs'
        >Back to Dashboard</button>
             </Link>
            </div>
           <div className='border-2 border-gray-200 bg-white mt-5 p-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5 w-full'>
             <label htmlFor="Product Name" className='text-black font-semibold text-xs'>Product Name *</label>
             <input type="text" name="" id="" placeholder='Enter  Product Name' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
          </div>
          <div className='flex flex-col gap-1.5 w-full'>
             <label htmlFor="SKU" className='text-black font-semibold text-xs'>SKU *</label>
             <input type="text" name="" id="" placeholder='Enter Unique Product Code' className='
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0' />
          </div>
            </div>
           </div>



         </div>
    </section>
  )
}

export default page
