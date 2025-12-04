"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FiFileText,
  FiTag,
  FiGrid,
  FiShoppingCart,
  FiDollarSign,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import { usePathname } from "next/navigation";
import { useAuth } from "../_lib/AuthContext";
import { FaBell } from "react-icons/fa";
import path from "path/win32";
import { FaMessage } from "react-icons/fa6";
import type { Notification as MyNotification } from "../_lib/type";
import { getNotifications, readNotification } from "../_lib/notifications";
import { toast } from "react-toastify";

function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<MyNotification[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null); // track expanded notification

    useEffect(() => {
        const fetchNotifications = async () => {
          setLoading(true);
          try {
            const res = await getNotifications();
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  

  // Hide sidebar on both sign-up and login pages
  if (pathname.includes("signup") || pathname.includes("login")) {
    return null;
  }

  return (
    <aside
      className="hidden md:flex flex-col w-[230px] h-fit sticky left-0 
      bg-white border-r border-gray-200 p-5 overflow-y-auto"
    >
      <nav className="flex flex-col mt-5 text-[15px]">
        <Link
          href="/kyc-compliance"
          className={`flex ${pathname === "/kyc-compliance" ? "bg-gray-300" : ""} hover:bg-gray-100 p-3 transition-all duration-300 ease-in-out font-semibold items-center gap-3 text-black`}
        >
          <FiFileText /> KYC Compliance
        </Link>

        <Link
          href="/brand-profile"
          className={`flex ${pathname === "/brand-profile" ? "bg-gray-300" : ""} hover:bg-gray-100 p-3 transition-all duration-300 ease-in-out font-semibold items-center gap-3 text-black`}
        >
          <FiTag /> Brand Profile
        </Link>

        <Link
          href="/product-upload"
          title={
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? "Upload new products"
              : "Complete KYC to upload products"
          }
          className={`flex hover:bg-gray-50 ${
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? ""
              : "pointer-events-none cursor-not-allowed opacity-30"
          } font-semibold items-center ${pathname === "/product-upload" ? "bg-gray-300" : ""} p-3 hover:bg-gray-100 transition-all duration-300 ease-in-out gap-3 text-black`}
        >
          <FiGrid /> Product Catalog
        </Link>

        <Link
          href="/notifications"
          title={
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? "Upload new products"
              : "Complete KYC to upload products"
          }
          className={`flex hover:bg-gray-50 ${
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? ""
              : "pointer-events-none cursor-not-allowed opacity-30"
          } font-semibold items-center ${pathname === "/notifications" ? "bg-gray-300" : ""} p-3 hover:bg-gray-100 transition-all duration-300 ease-in-out gap-3 text-black`}
  
        >
         <div className="relative flex items-center gap-2">
  <FaBell />
  <span>Notifications</span>

  {notifications.length > 0 && (
    <span
      className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
    >
      {notifications.length}
    </span>
  )}
</div>
 
        </Link>

        <Link
          href="/"
          title={
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? "Upload new products"
              : "Complete KYC to upload products"
          }
          className={`flex hover:bg-gray-50 ${
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? ""
              : "pointer-events-none cursor-not-allowed opacity-30"
          } font-semibold items-center ${pathname === "/" ? "bg-gray-300" : ""} p-3 hover:bg-gray-100 transition-all duration-300 ease-in-out gap-3 text-black`}
          
        >
          <BsGraphUp /> Dashboard
        </Link>

        <Link
          href="/orders"
          title={
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? "Upload new products"
              : "Complete KYC to upload products"
          }
          className={`flex hover:bg-gray-50 ${
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? ""
              : "pointer-events-none cursor-not-allowed opacity-30"
          } font-semibold items-center ${pathname === "/orders" ? "bg-gray-300" : ""} p-3 hover:bg-gray-100 transition-all duration-300 ease-in-out gap-3 text-black`}
        >
          <FiShoppingCart /> Orders
        </Link>

        <Link
          href="/messages"
          title={
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? "Upload new products"
              : "Complete KYC to upload products"
          }
          className={`flex hover:bg-gray-50 ${
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? ""
              : "pointer-events-none cursor-not-allowed opacity-30"
          } font-semibold items-center ${pathname === "/messages" ? "bg-gray-300" : ""} p-3 hover:bg-gray-100 transition-all duration-300 ease-in-out gap-3 text-black`}
        >
          <FaMessage /> Messages
        </Link>

        <Link
          href="/payouts"
          title={
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? "Upload new products"
              : "Complete KYC to upload products"
          }
          className={`flex hover:bg-gray-50 ${
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? ""
              : "pointer-events-none cursor-not-allowed opacity-30"
          } font-semibold items-center ${pathname === "/payouts" ? "bg-gray-300" : ""} p-3 hover:bg-gray-100 transition-all duration-300 ease-in-out gap-3 text-black`}
          
        >
          <FiDollarSign /> Payouts
        </Link>

        <Link
          href="/settings"
          title={
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? "Upload new products"
              : "Complete KYC to upload products"
          }
          className={`flex hover:bg-gray-50 ${
            user?.is_bank_information_verified &&
            user?.is_business_verified &&
            user?.is_identity_verified
              ? ""
              : "pointer-events-none cursor-not-allowed opacity-30"
          } font-semibold items-center ${pathname === "/settings" ? "bg-gray-300" : ""} p-3 hover:bg-gray-100 transition-all duration-300 ease-in-out gap-3 text-black`}
        >
          <FiSettings /> Settings
        </Link>

        <hr className="my-3 border-gray-200" />

        <div className="flex hover:bg-red-100 p-3 ease-in-out transition-all duration-300 flex-col gap-4 mt-auto">
          <p
            onClick={logout}
            className="flex items-center cursor-pointer gap-3 text-red-500 hover:text-red-700"
          >
            <FiLogOut /> Logout
          </p>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
