"use client";
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import DashboardGrid from './_components/DashboardGrid'
import Products from './_components/Products'
import ProductsDetails from './_components/ProductsDetails'
import ProtectedRoute from './_components/ProtectedRoute'
import {fetchProducts} from "./_lib/product"
import { useAuth } from './_lib/AuthContext';

function page() {
  const { user, logout } = useAuth();
  const [businessName, setBusinessName] = useState("");
   const [products, setProducts] = useState([]);

  useEffect(() => {
     setBusinessName(user?.business_name || "");
    }, [user]);



  useEffect(() => {
    const getProducts = async () => {
      const res = await fetchProducts(1, 20);
      console.log(res);
      setProducts(res?.data?.data || []); // <---- Save into state
    };
    getProducts();
  }, []);

  return (
    <ProtectedRoute>
      <section className='bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full'>
      <div className='flex justify-between'>
             <div>
                <h1 className='text-black font-semibold text-xl'>Vendor Dashboard</h1>
      <p className='text-gray-500 text-[13px] mb-2'>Welcome back, {businessName}</p>
             </div>
             <Link href="/product-upload">
             <button
        className='bg-black capitalize  text-white p-[5px] w-fit text-xs'
        >Upload new product</button>
             </Link>
            </div>
        <DashboardGrid  products={products} /> 
        <div className='flex gap-2'>
          <Products products={products} /> 
          <ProductsDetails />
        </div>   
    </section>
    </ProtectedRoute>
  )
}

export default page
