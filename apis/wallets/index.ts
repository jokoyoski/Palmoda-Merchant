import { WalletResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchWallet = async (token: string | null) => {
  if (!token) {
    throw new Error("No auth token available");
  }

  const response = await axios.get<WalletResponse>(
    `${backendUrl}/sub_category/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const useSubCategories = () => {
  // 2. State to hold the token
  const [token, setToken] = useState<string | null>(null);
  // 3. State to know we are on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return useQuery({
    // 5. Add token to queryKey
    queryKey: ["wallet", token],
    queryFn: () => fetchWallet(token),
    enabled: isClient && !!token,
  });
};
