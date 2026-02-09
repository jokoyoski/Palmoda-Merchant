import { useQuery, QueryKey } from "@tanstack/react-query";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export type SubscriptionPaymentStatus =
  | "pending"
  | "success"
  | "failed"
  | string;

export type SubscriptionType = "monthly" | "anually" | "annual" | string;

export interface VendorSubscription {
  _id: string;
  vendor_id: string;
  subscription_type: SubscriptionType;
  amount: number;
  payment_method: string;
  payment_status: SubscriptionPaymentStatus;
  subscription_reference: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  expiry_date: string | null;
  payment_date: string | null;
}

export interface VendorSubscriptionsResponse {
  success: boolean;
  message: string;
  data: {
    subscriptions: VendorSubscription[];
    total_items: number;
    page_number: number;
    page_size: number;
  };
}

export interface VendorSubscriptionDetailsResponse {
  success: boolean;
  message: string;
  data: VendorSubscription & {
    vendor?: Record<string, unknown>;
  };
}

export type VendorSubscriptionsQuery = {
  status?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page_number?: number;
  page_size?: number;
};

export const fetchVendorSubscriptions = async (
  query: VendorSubscriptionsQuery,
  token: string
) => {
  if (!backendUrl) {
    throw new Error("Backend URL is not configured");
  }

  const res = await axios.get<VendorSubscriptionsResponse>(
    `${backendUrl}/vendor/subscriptions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: query,
    }
  );

  return res.data;
};

export const useVendorSubscriptions = (query: VendorSubscriptionsQuery) => {
  const token = getToken();

  return useQuery<VendorSubscriptionsResponse>({
    queryKey: ["vendorSubscriptions", query] as QueryKey,
    queryFn: () => fetchVendorSubscriptions(query, token as string),
    enabled: !!token,
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: true,
  });
};

export const fetchVendorSubscriptionDetails = async (id: string, token: string) => {
  if (!backendUrl) {
    throw new Error("Backend URL is not configured");
  }

  const res = await axios.get<VendorSubscriptionDetailsResponse>(
    `${backendUrl}/vendor/subscription/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const useVendorSubscriptionDetails = (id?: string) => {
  const token = getToken();

  return useQuery<VendorSubscriptionDetailsResponse>({
    queryKey: ["vendorSubscription", id] as QueryKey,
    queryFn: () => fetchVendorSubscriptionDetails(id as string, token as string),
    enabled: !!token && !!id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};
