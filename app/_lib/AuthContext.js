"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

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

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  // ============================================================
  // 🔥 GLOBAL TOAST WRAPPER
  // ============================================================
  const toastWithLog = (type, message, source = "unknown") => {
    toast[type](message, {
      data: { source },
    });
    console.log(`[Toast] [${source}]`, message);
  };

  useEffect(() => {
    // Optionally log toast events as they change
    const unsubscribe = toast.onChange((toastEvent) => {
      // console.log("Toast event changed:", toastEvent);
    });
    return () => unsubscribe();
  }, []);

  // ============================================================
  // ✔ RESTORE TOKEN & FETCH CURRENT VENDOR
  // ============================================================
  useEffect(() => {
    const savedAuth = localStorage.getItem("vendor_auth");
    const savedToken = localStorage.getItem("token");

    if (savedAuth && savedToken) {
      const decoded = decodeToken(savedToken);

      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        logout();
        setLoading(false);
        return;
      }

      setToken(savedToken);
      setIsAuthenticated(true);
      fetchCurrentVendor(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // 🔥 FETCH CURRENT VENDOR
  // ============================================================
  const fetchCurrentVendor = async (activeToken) => {
    try {
      const res = await axios.get(`${backendUrl}/vendor/get-current-vendor`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      if (res.data?.success) {
        setUser(res.data.data);
        localStorage.setItem("vendor_auth", JSON.stringify(res.data.data));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          toastWithLog("error", err.response.data?.message || "Unauthorized", "fetchCurrentVendor");
          logout();
        } else {
          toastWithLog("error", err.response?.data?.message || "Server error", "fetchCurrentVendor");
        }
      } else {
        toastWithLog("error", err.message || "Unexpected error", "fetchCurrentVendor");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔥 LOGIN
  // ============================================================
  const login = (authData) => {
    const userData = authData?.data || authData;
    if (!userData || !userData.token) {
      toastWithLog("error", "Login data invalid or missing token", "login");
      return;
    }

    localStorage.setItem("vendor_auth", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);

    setUser(userData);
    setToken(userData.token);
    setIsAuthenticated(true);

    if (userData.is_identity_verified && userData.is_bank_information_verified && userData.is_business_verified) {
      router.push("/");
    } else {
      router.push("/kyc-compliance");
    }

    toastWithLog("success", "Login successful!", "login");
  };

  // ============================================================
  // 🔥 LOGOUT
  // ============================================================
  const logout = () => {
    localStorage.removeItem("vendor_auth");
    localStorage.removeItem("token");

    setUser(null);
    setToken("");
    setIsAuthenticated(false);

    router.push("/login");
    toastWithLog("info", "Logged out", "logout");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading, toastWithLog }}>
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
