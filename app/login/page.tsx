"use client";
import React, { useState } from "react";
import { useAuth } from "../_lib/AuthContext";
import { vendorLogin } from "../_lib/vendor";
import { toast } from "react-toastify";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await vendorLogin(email, password);

      if (res.success) {
        login(res);
        // toast.success("Login Successful");
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center = px-4 mt-[-10px]">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Log In
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your password"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-0">
                <Button
                  onPress={() => setShowPassword(!showPassword)}
                  isIconOnly
                  startContent={showPassword ? <FaEye /> : <FaEyeSlash />}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading} // disable button when loading
            className={`w-full py-2 rounded-lg text-lg font-medium transition 
              ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-900"}`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link href="/forgot-password" className="text-center text-gray-600 text-sm mt-4">
          Forgot password?
        </Link>
        </div>

        <div className="justify-center text-center my-5">
          <small>Don't Have an account?</small>{" "}
          <Link href="/signup" className="text-blue-500">
            <small>Sign Up</small>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page;
