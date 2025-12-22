"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import { useOrderDetails } from "@/app/_lib/useOrders";
import Image from "next/image";
import { useFetchColors } from "@/app/_lib/colors";
import { useFetchSizes } from "@/app/_lib/sizes";
import { useFetchGenders } from "@/app/_lib/gender";
import { useSubCategories } from "@/apis/wallets";
import { useCategories } from "@/app/_lib/categories";
import { CategoryQueryParams } from "@/types";

// Helper function for styling the status badge
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "created":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrderDetailsPage() {
  const { _id } = useParams();
  const orderId = _id as string;
  const { data, isLoading, isError } = useOrderDetails(orderId);

  const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
    page_number: 1,
    page_size: 10,
    filter: {
      search_term: null,
      countries: {
        $in: [],
      },
    },
    sort_field: "name",
    sort_direction: 1,
  });

  const { data: categoriesArray = [] } = useCategories(queryParams);
  const { data: subCategoriesArray = [] } = useSubCategories();
  const { data: gendersArray = [] } = useFetchGenders();
  const { data: sizesArray = [] } = useFetchSizes();
  const { data: colorsArray = [] } = useFetchColors();

  // Helper functions to get names from IDs
  const getCategoryName = (categoryId: string) => {
    const category = categoriesArray?.find((cat: any) => cat._id === categoryId);
    return category?.name || categoryId;
  };

  const getColorName = (colorId: string) => {
    const color = colorsArray?.find((col: any) => col._id === colorId);
    return color?.name || colorId;
  };

  const getSizeName = (sizeId: string) => {
    const size = sizesArray?.find((s: any) => s._id === sizeId);
    return size?.name || sizeId;
  };

  const getGenderName = (genderId: string) => {
    const gender = gendersArray?.find((g: any) => g._id === genderId);
    return gender?.name || genderId;
  };

  if (isLoading)
    return <div className="p-6 text-center text-xl font-medium text-gray-700">Loading order details...</div>;

  if (isError || !data?.data || data.data.length === 0)
    return <div className="p-6 text-center text-xl font-medium text-red-500">Failed to load order or order not found.</div>;

  const orderDetail = data.data[0];
  const orderInfo = orderDetail.order_info;
  const address = orderInfo.address;
  const item = orderDetail.item;

  // Format transaction date nicely
  const formattedDate = new Date(orderInfo.transaction_date.$date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ProtectedRoute>
      <section className="min-h-screen bg-gray-50 p-5 md:p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order: #{orderInfo.transaction_reference}</h1>
        <div className="flex items-center gap-3 mb-8">
          <span 
            className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(orderInfo.status)}`}
          >
            {orderInfo.status.toUpperCase()}
          </span>
          <p className="text-sm text-gray-500">
            Placed on: <span className="font-medium">{formattedDate}</span>
          </p>
        </div>

        {/* --- GRID LAYOUT: Summary, Customer, and Item Details --- */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          
          {/* 1. ORDER SUMMARY CARD */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-md h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Financial Summary</h2>
            <DetailRow label="Subtotal" value={`₦${orderDetail.amount.toLocaleString()}`} />
            <DetailRow label="Delivery Fee" value={`₦${orderInfo.delivery_fee.toLocaleString()}`} />
            <DetailRow label="Tax Rate" value={`${orderInfo.tax}%`} />
            <div className="mt-4 pt-4 border-t border-gray-200">
              <DetailRow label="Total Amount Paid" value={`₦${(orderDetail.amount + orderInfo.delivery_fee).toLocaleString()}`} isTotal />
            </div>
          </div>

          {/* 2. CUSTOMER & ADDRESS INFO CARD */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-md h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Customer & Delivery</h2>
            
            <h3 className="font-medium text-gray-700 mt-2">Recipient</h3>
            <p className="text-sm text-gray-600">{address.first_name} {address.last_name}</p>
            <p className="text-sm text-gray-600 mb-3">{orderDetail.user.email}</p>
            
            <h3 className="font-medium text-gray-700 mt-4">Contact Info</h3>
            <p className="text-sm text-gray-600">{address.phone_number}</p>

            <h3 className="font-medium text-gray-700 mt-4">Shipping Address</h3>
            <p className="text-sm text-gray-600">{address.address}</p>
            <p className="text-sm text-gray-600">{address.city}, {address.state}, {address.postalcode}</p>
            <p className="text-sm text-gray-600">{address.country}</p>
          </div>

          {/* 3. PRODUCT ITEM CARD */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-md h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Product Details</h2>
            
            <div className="flex items-start space-x-4 mb-4">
              {item.images && item.images.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover border"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-black">{item.name}</h3>
                <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                <p className="text-sm text-gray-500">Qty: <strong>{orderDetail.quantity}</strong></p>
              </div>
            </div>

            <DetailRow label="Price per unit" value={`₦${item.discounted_price.toLocaleString()}`} />
            <DetailRow 
              label="Category" 
              value={item.categories?.length ? getCategoryName(item.categories[0]) : 'N/A'} 
            />
            <DetailRow 
              label="Color" 
              value={item.colors?.length ? getColorName(item.colors[0]) : 'N/A'} 
            />
            <DetailRow 
              label="Size" 
              value={item.sizes?.length ? getSizeName(item.sizes[0]) : 'N/A'} 
            />
            {/* {item.gender && (
              <DetailRow 
                label="Gender" 
                value={getGenderName(item.gender)} 
              />
            )} */}
          </div>
        </div>

        {/* --- ORDER TRACKING TIMELINE --- */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Order Tracking History</h2>
          <TrackingTimeline tracking={orderDetail.tracking} />
        </div>
      </section>
    </ProtectedRoute>
  );
}

// --- Helper Components for cleaner JSX ---

const DetailRow = ({ label, value, isTotal = false }: { label: string, value: string, isTotal?: boolean }) => (
  <div className={`flex justify-between items-center py-1 ${isTotal ? 'text-lg font-bold text-gray-900' : 'text-sm text-gray-600'}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const TrackingTimeline = ({ tracking }: { tracking: any[] }) => {
  const sortedTracking = [...tracking].sort((a, b) => new Date(b.date.$date).getTime() - new Date(a.date.$date).getTime());

  return (
    <ol className="relative border-s border-gray-200 ms-3">                  
      {sortedTracking.map((track, index) => {
        const isLatest = index === 0;
        const date = new Date(track.date.$date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return (
          <li key={index} className="mb-8 ms-8">
            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ${isLatest ? 'bg-indigo-600 ring-indigo-50' : 'bg-gray-300 ring-gray-50'}`}>
              {isLatest && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z" clipRule="evenodd" fillRule="evenodd"></path></svg>}
            </span>
            <h3 className={`flex items-center mb-1 text-lg font-semibold ${isLatest ? 'text-indigo-600' : 'text-gray-900'}`}>
              {track.status.charAt(0).toUpperCase() + track.status.slice(1)}
              {isLatest && <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded ms-3">Latest</span>}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
              {formattedDate} at {formattedTime}
            </time>
          </li>
        );
      })}
    </ol>
  );
};