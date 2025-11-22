import { SubCategoryResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchSubCategories = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get<SubCategoryResponse>(
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
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["subCategories"],
    queryFn: () => fetchSubCategories(),
    enabled: !!token,
  });
};
