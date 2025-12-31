"use client";

import { CountryResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchCountries = async (token: string | null) => {
  if (!token) return null;

  const response = await axios.get<CountryResponse>(
    `${backendUrl}/country-section`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const useFetchCountries = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return useQuery({
    queryKey: ["countries", token],
    queryFn: () => fetchCountries(token),
    enabled: isClient && !!token,
  });
};
