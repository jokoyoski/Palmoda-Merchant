"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { CiUser } from "react-icons/ci";
import React, { useEffect, useState, useRef } from "react";
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
import { toast } from "react-toastify";
import { Avatar } from "@heroui/avatar";

function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    // { href: "/signup", label: "Sign Up", icon: <FiUserPlus /> },
    { href: "/kyc-compliance", label: "KYC Compliance", icon: <FiFileText /> },
    { href: "/brand-profile", label: "Brand Profile", icon: <FiTag /> },
    { href: "/product-catalog", label: "Product Catalog", icon: <FiGrid /> },
    { href: "/", label: "Dashboard", icon: <BsGraphUp /> },
    { href: "/orders", label: "Orders", icon: <FiShoppingCart /> },
    { href: "/payouts", label: "Payouts", icon: <FiDollarSign /> },
    { href: "/settings", label: "Settings", icon: <FiSettings /> },
  ];

  useEffect(() => {
    setUserName(user?.contact_person_name || "");
  }, [user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ❗ RETURN AFTER ALL HOOKS
  if (pathname.includes("signup") || pathname.includes("login") || pathname.includes("forgot-password")) {
    return null;
  }

  return (
    <>
      <header className="flex fixed top-0 left-0 w-full items-center justify-between px-4 py-3 border-b border-b-gray-200 bg-white z-[10000]">
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

        
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Avatar
              icon={<CiUser size={20} />}
              classNames={{
                base: "bg-gray-200",
                icon: "text-black",
              }}
              size="sm"
            />
            <h2 className="font-semibold text-black text-[15px] hidden md:block">
              {username}
            </h2>
          </div>

          {/* Custom Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[10001]"
              style={{ zIndex: 99999 }}
            >
              {/* Profile Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-sm text-black">{user?.business_name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1 border-b border-gray-100">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100 flex items-center gap-2"
                >
                  <CiUser size={18} />
                  View Profile
                </button>
                <button
                  onClick={() => {
                    router.push("/settings");
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-black hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiSettings size={16} />
                  Settings
                </button>
              </div>

              {/* Logout */}
              <div className="py-1">
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
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
            {navItems.map((item) => {
              // Special handling for Product Catalog
              if (item.href === "/product-catalog") {
                const isKycComplete = user?.is_bank_information_verified && user?.is_business_verified && user?.is_identity_verified;
                const hasWallet = user?.is_wallet_activated;
                const canAccess = isKycComplete && hasWallet;

                const handleClick = (e: React.MouseEvent) => {
                  if (!canAccess) {
                    e.preventDefault();
                    return;
                  }
                  setMobileMenuOpen(false);
                };

                return (
                  <Link
                    key={item.href}
                    href="/product-upload"
                    className={`flex items-center font-semibold gap-5 text-[15px] ${!authLoading && !canAccess ? "opacity-50 pointer-events-none" : ""}`}
                    onClick={handleClick}
                    title={
                      !isKycComplete
                        ? "Complete KYC to access Product Catalog"
                        : !hasWallet
                        ? "Please activate your wallet to access Product Catalog"
                        : "Upload new products"
                    }
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center font-semibold gap-5 text-[15px]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}

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
