"use client";

import { SubCategoryResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// 1. Modify fetch function to accept token as an argument
const fetchGenders = async (token: string | null) => {
  if (!token) return null;

  const response = await axios.get<SubCategoryResponse>(
    `${backendUrl}/gender/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const useFetchGenders = () => {
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
    queryKey: ["genders", token],
    // 6. Pass token to fetch function
    queryFn: () => fetchGenders(token),
    // 7. Enable only on client AND when token exists
    enabled: isClient && !!token,
  });
};
