import { CategoriesResponse, CategoryQueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchCategories = async (
  queryParamsObj: CategoryQueryParams,
  token: string | null
) => {
  // Safety check: This shouldn't be called without a token due to 'enabled' check below
  if (!token) return null;

  const jsonString = JSON.stringify(queryParamsObj);
  const encodedQuery = encodeURIComponent(jsonString);

  const fullUrl = `${backendUrl}/category/list/admin?query=${encodedQuery}`;
  const response = await axios.get<CategoriesResponse>(fullUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data.data;
};

export const useCategories = (queryParams: CategoryQueryParams) => {
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
    // 5. Add token to queryKey so it refetches when token changes
    queryKey: ["categories", queryParams, token],
    // 6. Pass the token state to the fetch function
    queryFn: () => fetchCategories(queryParams, token),
    // 7. IMPORTANT: Only enable query on client AND when token exists
    enabled: isClient && !!token,
  });
};
