"use client";
import ProtectedRoute from '@/app/_components/ProtectedRoute'
import { useAuth } from '@/app/_lib/AuthContext';
import React, { useEffect, useState } from 'react'
import { Product } from "../../_lib/type"
import { fetchProducts } from '@/app/_lib/product';
import { useParams } from 'next/navigation';
import ProductComponent from '../Product';

function page() {
    const { user, logout } = useAuth();
     const [products, setProducts] = useState<Product[]>([]);
     const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
     const {_id} =useParams();
     useEffect(() => {
         const getProducts = async () => {
            setLoading(true);
           const res = await fetchProducts(1, 100);
           console.log(res);
           setProducts(res?.data?.data || []); 
           setLoading(false);
         };
         getProducts();
       }, []);
     
     const product = products.find((item) => item._id === _id);
     console.log(product); 



     if (loading) {
            return (
              <ProtectedRoute>
                <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full flex items-center justify-center">
                <p className="text-gray-500 text-sm">Loading Product details...</p>
              </section>
              </ProtectedRoute>
            );
          }
         
          if (error) {
            return (
              <ProtectedRoute>
                <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-red-500 font-bold text-lg">{error || "Vendor not found"}</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    The vendor you are trying to review does not exist or has been removed.
                  </p>
                </div>
              </section>
              </ProtectedRoute>
            );
          } 

          if (!product) {
  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen flex items-center justify-center">
        <h1 className="text-red-500 text-lg font-semibold">Product not found</h1>
      </section>
    </ProtectedRoute>
  );
}
     
     
  return (
    <ProtectedRoute>
        <section className='bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full'>
        <div className='flex items-center justify-between'>
                 <div>
                  <h1 className='text-black font-bold text-xl'>Product Review</h1>
                 
                 </div>
                 <div className='flex gap-3 items-center'>
                {/* <button
                className='bg-inherit border  border-black text-black py-[5px] px-2.5 w-fit text-xs'
                >Filter Status</button>
                 <button
                className='bg-inherit border border-black text-black py-[5px] px-2.5
                 w-fit text-xs'
                >Sort Date</button> */}
                </div>
              </div>
            <ProductComponent product={product} />
    </section>
    </ProtectedRoute>
  )
}

export default page
