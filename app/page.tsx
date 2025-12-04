"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DashboardGrid from "./_components/DashboardGrid";
import Products from "./_components/Products";
import ProductsDetails from "./_components/ProductsDetails";
import ProtectedRoute from "./_components/ProtectedRoute";
import { fetchProducts } from "./_lib/product";
import { useAuth } from "./_lib/AuthContext";
import { getBrandDetails } from "./_lib/brand";
import type { Notification as MyNotification } from "./_lib/type";
import {getNotifications} from "./_lib/notifications"
import { toast } from "react-toastify";

// Add this at the top of your file
interface ProductType {
  _id: string;
  name: string;
  discounted_price: number;
  status: string;
  quantity: number;
  images: string[];
  sku: string;
}

// Then type your state properly:

function page() {
  const { user, logout } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<MyNotification[]>([]);


  useEffect(() => {
    setBusinessName(user?.business_name || "");
    console.log(user?.business_name);
  }, [user]);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await getBrandDetails();
        console.log(res);
        setBrand(res.data);

        if (res.success === false || !res.data) {
          // No brand exists
        } else {
          const data = res.data;
        }
      } catch (err: any) {
      } finally {
      }
    };

    fetchBrand();
  }, []);

 useEffect(() => {
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      console.log(res);
      const notifs: MyNotification[] = res.data?.notifications || [];
      setNotifications(notifs);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();
}, []);



  const basicInfoComplete = !!businessName && businessName.trim() !== "";
  const brandStoryComplete =
    !!brand?.brand_description && brand.brand_description.trim() !== "";

  const brandMediaComplete =
    !!brand?.brand_banner && brand.brand_banner.trim() !== "";

  // Count completed steps
  const stepsCompleted = [
    basicInfoComplete,
    brandStoryComplete,
    brandMediaComplete,
  ].filter(Boolean).length;

  // Total steps
  const totalSteps = 3;

  // Percentage
  const completionPercent = Math.round((stepsCompleted / totalSteps) * 100);

  useEffect(() => {
    const getProducts = async () => {
      const res = await fetchProducts(1, 100);
      console.log(res);
      setProducts(res?.data?.data || []);
    };
    getProducts();
  }, []);

  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full">
        <div className="flex justify-between">
          <div>
            <h1 className="text-black font-semibold text-xl">
              Vendor Dashboard
            </h1>
            <p className="text-gray-500 text-[13px] mb-2">
              Welcome back, {businessName}
            </p>
          </div>

          { user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified &&   <Link href="/product-upload">
            <button className="bg-black capitalize  text-white p-[5px] w-fit text-xs">
              Upload new product
            </button>
          </Link>}
         
        </div>
        <DashboardGrid products={products} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Products – takes 2 columns */}
          <div className="col-span-1 lg:col-span-2">
            <Products products={products} setProducts={setProducts} />
          </div>

          {/* Details – takes 1 column */}
          <div className="col-span-1 lg:col-span-1">
            <ProductsDetails notifications={notifications} loading={loading} />
          </div>
        </div>

        <div className="bg-white rounded-[6px] px-6 pt-3 pb-5 w-full mt-5 mb-3">
          <h1 className="text-black font-semibold text-sm">
            Complete Your Brand Profile
          </h1>

          {/* Progress bar */}
          <div className="w-full mt-4">
            <div className="h-[4px] bg-gray-200 rounded-full w-full">
              <div
                className="h-[4px] bg-black rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-600 mt-1">
              {completionPercent}%
            </p>
          </div>

          {/* Steps container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 mb-4">
            {/* Basic Info */}
            <div className="border border-gray-200 rounded-[5x] py-4 px-6 flex items-center gap-3">
              <div>
                {basicInfoComplete ? (
                  <span className="text-green-600 bg-green-100 p-2 rounded-[50%] text-lg">
                    ✔
                  </span>
                ) : (
                  <span className="text-yellow-500 bg-yellow-100 p-2 rouned-[50%] text-lg">
                    ●
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-black">
                  Basic Information
                </p>
                <p className="text-xs text-gray-500">
                  {basicInfoComplete ? "Completed" : "Incomplete"}
                </p>
              </div>
            </div>

            {/* Brand Story */}
            <div className="border border-gray-200 rounded-[5x] py-4 px-6 flex items-center gap-2">
              <div>
                {brandStoryComplete ? (
                  <span className="text-green-600 bg-green-100 p-2 rounded-[50%] text-lg">
                    ✔
                  </span>
                ) : (
                  <span className="text-yellow-500 bg-yellow-100 p-2 rouned-[50%] text-lg">
                    ●
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-black">Brand Story</p>
                <p className="text-xs text-gray-500">
                  {brandStoryComplete ? "Completed" : "Incomplete"}
                </p>
              </div>
            </div>

            {/* Brand Media */}
            <div className="border border-gray-200 rounded-[5x] py-4 px-6 flex items-center gap-2">
              <div>
                {brandMediaComplete ? (
                  <span className="text-green-600 bg-green-100 p-2 rounded-[50%] text-lg">
                    ✔
                  </span>
                ) : (
                  <span className="text-yellow-500 bg-yellow-100 p-2 rouned-[50%] text-lg">
                    ●
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-black">Brand Media</p>
                <p className="text-xs text-gray-500">
                  {brandMediaComplete ? "Completed" : "In Progress"}
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/brand-profile"
            className="text-xs mt-4 px-4 py-2 mb-5 border border-black text-black uppercase bg-inherit"
          >
            Go to Brand Profile
          </Link>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default page;
