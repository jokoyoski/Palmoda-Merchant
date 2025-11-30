"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import React, { useEffect, useState } from "react";
import {
  FiUserPlus,
  FiFileText,
  FiTag,
  FiGrid,
  FiShoppingCart,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import { useAuth } from "../_lib/AuthContext";

function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUserName] = useState("");
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    // { href: "/signup", label: "Sign Up", icon: <FiUserPlus /> },
    { href: "/kyc-compliance", label: "KYC Compliance", icon: <FiFileText /> },
    { href: "/brand-profile", label: "Brand Profile", icon: <FiTag /> },
    { href: "/product-catalog", label: "Product Catalog", icon: <FiGrid /> },
    { href: "/dashboard", label: "Dashboard", icon: <BsGraphUp /> },
    { href: "/orders", label: "Orders", icon: <FiShoppingCart /> },
    { href: "/payouts", label: "Payouts", icon: <FiDollarSign /> },
    { href: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  useEffect(() => {
    setUserName(user?.contact_person_name || "");
  }, [user]);

  // ❗ RETURN AFTER ALL HOOKS
  if (pathname.includes("signup") || pathname.includes("login")) {
    return null;
  }

  return (
    <>
      <header className="flex fixed top-0 left-0 w-full items-center justify-between px-4 py-3 border-b border-b-gray-200 bg-white z-50">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <Link
            href="/"
            className="uppercase text-black text-[15px] font-semibold"
          >
            Palmoda
          </Link>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1 w-fit md:w-[400px] focus-within:ring-2 focus-within:ring-gray-300 transition">
          <FiSearch className="text-gray-500 text-[18px]" />
          <input
            type="search"
            placeholder="Search for brands, products and more"
            className="bg-transparent outline-none text-[14px] text-gray-700 placeholder-gray-500 w-full px-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CiUser size={25} color="black" />
            <h2 className="font-semibold text-black text-[15px]">{username}</h2>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-10 left-0 w-full h-screen bg-black/50 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <aside
          className={`bg-gray-50 w-64 h-full p-5 overflow-y-auto fixed top-0 left-0 transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col gap-5 mt-20 text-[15px]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center font-semibold gap-5 text-[15px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <hr className="my-3 border-gray-200" />

            <button
              onClick={logout}
              className="flex items-center gap-3 text-red-500 hover:text-red-700 mt-auto"
            >
              Logout
            </button>
          </nav>
        </aside>
      </div>
    </>
  );
}

export default Header;
