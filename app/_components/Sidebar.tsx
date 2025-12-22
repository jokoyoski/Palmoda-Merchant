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
import { getNotifications, notificationCount, readNotification } from "../_lib/notifications";
import { toast } from "react-toastify";
import { useNotificationCount } from "../_lib/useNotifications";
import { useMessageCount } from "../_lib/useMessages";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: countData } = useNotificationCount();
  const { data: msgcountData } = useMessageCount();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const count = countData?.data?.count || 0;
  const messageCount = msgcountData?.data?.unread_count || 0;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("No token in localStorage");
      return;
    }

    setToken(storedToken);
  }, []);

  // ✅ Add logout confirmation handler
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      logout();
    }
  };

  // Hide sidebar on both sign-up and login pages
  if (pathname.includes("signup") || pathname.includes("login") || pathname.includes("forgot-password")) {
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

              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count || 0}
              </span>
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
          <div className="relative flex items-center gap-2">
            <FaMessage />
            <span>Messages</span>

              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {messageCount || 0}
              </span>
          </div>
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
          {/* ✅ Changed from onClick={logout} to onClick={handleLogout} */}
          <p
            onClick={handleLogout}
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