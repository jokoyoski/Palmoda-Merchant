import Link from 'next/link'
import React from 'react'
import DashboardGrid from './_components/DashboardGrid'
import Products from './_components/Products'
import ProductsDetails from './_components/ProductsDetails'

function page() {
  return (
    <section className='bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full'>
      <div className='flex justify-between'>
             <div>
                <h1 className='text-black font-semibold text-xl'>Vendor Dashboard</h1>
        <p className='text-gray-500 text-[13px] mb-2'>Welcome back, Laurent Fashion House</p>
             </div>
             <Link href="/product-upload">
             <button
        className='bg-black capitalize  text-white p-[5px] w-fit text-xs'
        >Upload new product</button>
             </Link>
            </div>
        <DashboardGrid /> 
        <div className='flex gap-2'>
          <Products />
          <ProductsDetails />
        </div>   
    </section>
  )
}

export default page
