export interface Vendor {
  _id: string;
  business_name: string;
  contact_person_name: string;
  email: string;
  phone_number: string;
  code: string;
  code_expiry: string | Date;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  is_business_verified: boolean;
  is_identity_verified: boolean;
  is_bank_information_verified: boolean;
  is_wallet_activated: boolean;
  is_deleted: boolean;
  is_verified: boolean;
  notes: string;
  brand: Brand;
  kyc_compliance: KycCompliance;
}

export interface Brand {
  _id: string;
  vendor_id: string;
  brand_name: string;
  brand_description: string;
  brand_logo_black: string;
  brand_logo_white: string;
  brand_banner: string;
  instagram_handle: string;
  facebook_handle: string;
  twitter_handle: string;
  website_url: string;
  tiktok_handle: string;
  pinterest_handle: string;
  created_at: string;
  updated_at: string;
}

export interface KycCompliance {
  _id: string;
  vendor_id: string;
  business_registration_document: string;
  valid_owner_id: string;
  bank_statement: string;
  business_type: string;
  registration_number: string;
  tax_identification_number: string;
  address_line_one: string;
  address_line_two: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  _id: string;
  vendor_id: string;
  name: string;
  images: string[];
  cost_price: number;
  description: string;
  look_after_me: string;
  countries: string[];
  quantity: number;
  categories: string[];
  sub_categories: string[];
  genders: string[] | any[]; 
  colors: string[];
  sizes: string[];
  fabrics: string[] ; 
  discounted_price: number;
  sku: string;
  created_at: string;
  updated_at: string;
  status: string;
  is_active: boolean;
  hidden: boolean;
  rejection_reason?: string;
}

export interface PayoutType {
  _id: string;
  vendor_id: string;
  amount: number;
  transaction_reference: string;
  status: "pending" | "successful" | "failed";
  narration: string;
  transaction_type: "debit" | "credit";
  created_at: string;
  updated_at: string;
  rejection_reason?: string;
  vendor: Vendor;
}

export interface TransactionType {
  _id: string;
  vendor_id: string;
  amount: number;
  transaction_reference: string;
  status: "pending" | "failed" | "successful"; 
  narration: string;
  transaction_type: "credit" | "debit";
  created_at: string;
  updated_at: string;
  vendor: Vendor;
}

export interface NotificationDetails {
  _id: string;
  vendor_id: string;
  amount: number;
  transaction_reference: string;
  status: string; // "failed", "successful", etc.
  narration: string;
  transaction_type: string; // "debit" | "credit"
  created_at: string; // e.g. "2025-11-28 19:39:55"
  updated_at: string;
  rejection_reason?: string; // optional, may not exist
}

export interface Notification {
  _id: string;
  title: string;
  content: string;
  type: string; // e.g. "payout"
  vendor_id: string;
  created_at: string; // e.g. "2025-11-29 00:48:47"
  details: NotificationDetails;
}
