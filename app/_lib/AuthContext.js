"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  // ============================================================
  // ✔ RESTORE TOKEN & FETCH CURRENT VENDOR FROM BACKEND
  // ============================================================
  useEffect(() => {
    const savedAuth = localStorage.getItem("vendor_auth");
    const savedToken = localStorage.getItem("token");

    if (savedAuth && savedToken) {
      const decoded = decodeToken(savedToken);

      // ❌ Token expired → force logout
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        logout();
        setLoading(false);
        return;
      }

      setToken(savedToken);
      setIsAuthenticated(true);

      // Step 2: Fetch updated vendor info
      fetchCurrentVendor(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // 🔥 FUNCTION: Fetch Current Vendor From Backend
  // ============================================================
  const fetchCurrentVendor = async (activeToken) => {
    try {
      const res = await axios.get(`${backendUrl}/vendor/get-current-vendor`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      if (res.data?.success) {
        setUser(res.data.data); // Update global user state
        localStorage.setItem("vendor_auth", JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.log("Vendor fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = (authData) => {
    if (!authData?.data) return;

    localStorage.setItem("vendor_auth", JSON.stringify(authData.data));
    localStorage.setItem("token", authData.data.token);

    setUser(authData.data);
    setToken(authData.data.token);
    setIsAuthenticated(true);

    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("vendor_auth");
    localStorage.removeItem("token");

    setUser(null);
    setToken("");
    setIsAuthenticated(false);

    router.push("/login");
  };

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user,
          token,
          isAuthenticated,
          login,
          logout,
          loading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
