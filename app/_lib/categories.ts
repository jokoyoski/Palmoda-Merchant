import { CategoriesResponse, CategoryQueryParams } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchCategories = async (queryParamsObj: CategoryQueryParams) => {
  // 1. Convert the JS object into a JSON string
  const token = localStorage.getItem("token");

  const jsonString = JSON.stringify(queryParamsObj);
  const encodedQuery = encodeURIComponent(jsonString);

  // 3. Construct the full URL with the single 'query' parameter
  const fullUrl = `${backendUrl}/category/list/admin?query=${encodedQuery}`;
  const response = await axios.get<CategoriesResponse>(fullUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data.data;
};

export const useCategories = (queryParams: CategoryQueryParams) => {
  const token = localStorage.getItem("token");

  return useQuery({
    // The queryKey includes the params so the query refetches if filters/sort/pagination change.
    queryKey: ["categories", queryParams],
    queryFn: () => fetchCategories(queryParams),
    // Optional: Do not run the query if there is no token
    enabled: !!token,
  });
};
