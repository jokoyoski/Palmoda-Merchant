"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // 🔥 NEW

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem("vendor_auth");
    const savedToken = localStorage.getItem("token");

    if (savedAuth && savedToken) {
      const parsed = JSON.parse(savedAuth);
      const decoded = decodeToken(savedToken);

      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        logout();
        setLoading(false);
        return;
      }

      setUser(parsed);
      setToken(savedToken);
      setIsAuthenticated(true);
    }

    setLoading(false); // 🔥 STOP LOADING AFTER RESTORE
  }, []);

  const login = (authData) => {
    if (!authData || !authData.data) return;

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

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
        loading, // 🔥 expose loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
