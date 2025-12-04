"use client";

import { ColorResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// 1. Modify fetch function to accept token as an argument
const fetchColors = async (token: string | null) => {
  if (!token) return null;

  const response = await axios.get<ColorResponse>(`${backendUrl}/color/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const useFetchColors = () => {
  // 2. State to hold the token
  const [token, setToken] = useState<string | null>(null);
  // 3. State to know we are on the client
  const [isClient, setIsClient] = useState(false);

  // 4. Use useEffect to get the token ONLY on the client-side
  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return useQuery({
    // 5. Add token to queryKey
    queryKey: ["colors", token],
    // 6. Pass token to fetch function
    queryFn: () => fetchColors(token),
    // 7. Enable only on client AND when token exists
    enabled: isClient && !!token,
  });
};


export const addColor = async (name:string, code:string) => {
  try {
     const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.post(`${backendUrl}/color/create`, {name, code}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error:any) {
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}