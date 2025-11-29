"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FiUserPlus,
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

function Sidebar() {
  const pathname = usePathname();
  const {logout} = useAuth();
const [token, setToken] = useState<string | null>(null);

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
      <nav className="flex flex-col gap-5 mt-5 text-[15px]">
        

        <Link
          href="/kyc-compliance"
          className="flex hover:bg-gray-50 font-semibold items-center gap-3 text-black"
        >
          <FiFileText /> KYC Compliance
        </Link>

        <Link
          href="/brand-profile"
          className="flex hover:bg-gray-50 font-semibold items-center gap-3 text-black"
        >
          <FiTag /> Brand Profile
        </Link>

        <Link
          href="/product-upload"
          className="flex hover:bg-gray-50 font-semibold items-center gap-3 text-black"
        >
          <FiGrid /> Product Catalog
        </Link>

        <Link
          href="/notifications"
          className="flex hover:bg-gray-50 font-semibold items-center gap-3 text-black"
        >
          <FaBell /> Notifications
        </Link>

        <Link
          href="/"
          className="flex hover:bg-gray-50 font-semibold items-center gap-3 text-black"
        >
          <BsGraphUp /> Dashboard
        </Link>

        <Link
          href="/orders"
          className="flex hover:bg-gray-50 font-semibold items-center gap-3 text-black"
        >
          <FiShoppingCart /> Orders
        </Link>

        <Link
          href="/payouts"
          className="flex hover:bg-gray-50 font-semibold items-center gap-3 text-black"
        >
          <FiDollarSign /> Payouts
        </Link>

        <Link
          href="/settings"
          className="flex hover:bg-gray-50 font-semibold items-center gap-3 text-black"
        >
          <FiSettings /> Settings
        </Link>

        <hr className="my-3 border-gray-200" />

        <div className="flex flex-col gap-4 mt-auto">
          {/* <div className="bg-gray-100 text-gray-800 rounded-lg p-3 text-sm">
            <p className="font-medium">New Feature Available</p>
            <p className="text-xs text-gray-600 mt-1">
              Enhanced analytics dashboard is now available for all vendors.
            </p>
          </div> */}

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
