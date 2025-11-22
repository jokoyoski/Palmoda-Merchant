import { ColorResponse, SubCategoryResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchColors = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get<ColorResponse>(`${backendUrl}/color/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const useFetchColors = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["colors"],
    queryFn: () => fetchColors(),
    enabled: !!token,
  });
};
