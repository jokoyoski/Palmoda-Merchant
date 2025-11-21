"use client";
import React from 'react'
import ProtectedRoute from '../_components/ProtectedRoute'

function page() {
  return (
    <ProtectedRoute>
      <div className='bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full'>
      <h1>Orders</h1>
    </div>
    </ProtectedRoute>
  )
}

export default page
