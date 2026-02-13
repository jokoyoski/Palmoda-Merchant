"use client";
import { useRef, useState, ChangeEvent, useEffect } from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import {
  getKycDetails,
  fetchBanks,
  resolveAccount,
  updateKyc,
} from "../_lib/vendor";
import axios from "axios";
import { toast } from "react-toastify";
import UploadBox from "./Upload";
import { useAuth } from "../_lib/AuthContext";
import { useRouter } from "next/navigation";
import { Bank } from "../_lib/type";
import { COUNTRIES, COUNTRY_STATES } from "@/constants/countries";
import BackButton from "../_components/BackButton";

// Cloudinary config
const cloudName = "jokoyoski";
const uploadPreset = "jokoyoski";

const developmentMode = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === "true";

const uploadToCloudinary = async (file: File): Promise<string | null> => {
  try {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return null;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const res = await axios.post(uploadUrl, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data?.secure_url ?? null;
  } catch (e: any) {
    console.error("Cloudinary upload error:", e);

    if (e.response?.data?.error?.message) {
      toast.error(`Upload failed: ${e.response.data.error.message}`);
    } else if (e.response?.status === 400) {
      toast.error("Upload failed: Invalid upload preset or file format");
      console.log(e);
    } else {
      toast.error("Upload failed. Please try again.");
    }

    return null;
  }
};

function Page() {
  // file URLs that backend expects
  const [businessDocUrl, setBusinessDocUrl] = useState<string>("");
  const [ownerIdUrl, setOwnerIdUrl] = useState<string>("");
  const [bankStatementUrl, setBankStatementUrl] = useState<string>("");

  // refs for hidden file inputs
  const businessInputRef = useRef<HTMLInputElement | null>(null);
  const ownerInputRef = useRef<HTMLInputElement | null>(null);
  const bankInputRef = useRef<HTMLInputElement | null>(null);

  // form fields
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [certified, setCertified] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [kycExists, setKycExists] = useState(false); // tracks if KYC already exists in backend
  const [updating, setUpdating] = useState(false); // loading state for edit button
  const [bankSearch, setBankSearch] = useState(""); // what user types
  const [bankResults, setBankResults] = useState<Bank[]>([]); // fetched banks
  const [showBankDropdown, setShowBankDropdown] = useState(false); // toggle dropdown
  const [selectedBankCode, setSelectedBankCode] = useState(""); // store bank code

  const { user } = useAuth();
  const router = useRouter();
  // Disable editing only when vendor is fully verified
  const isDisabled = user?.is_verified;

  // Helper function to determine document status
  const getDocumentStatus = (
    isVerified: boolean | undefined,
    isRevoked: boolean | undefined
  ): "pending" | "approved" | "revoked" | undefined => {
    if (isRevoked && !isVerified) return "revoked";
    if (!isRevoked && isVerified) return "approved";
    if (!isRevoked && !isVerified) return "pending";
    return undefined;
  };

  // Document statuses based on user data
  const businessDocStatus = getDocumentStatus(
    user?.is_business_verified,
    user?.is_business_registration_revoked
  );
  const ownerIdStatus = getDocumentStatus(
    user?.is_identity_verified,
    user?.is_identity_verification_revoked
  );
  const bankStatementStatus = getDocumentStatus(
    user?.is_bank_information_verified,
    user?.is_bank_information_verification_revoked
  );

  // Check if all KYC documents have been approved
  const allKycApproved =
    businessDocStatus === "approved" &&
    ownerIdStatus === "approved" &&
    bankStatementStatus === "approved";

  useEffect(() => {
    if (!bankSearch) {
      setBankResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      const res = await fetchBanks(bankSearch);
      console.log(res);
      if (res?.success) {
        setBankResults(res.data?.banks || []);
      } else {
        setBankResults([]);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [bankSearch]);

  useEffect(() => {
    const resolve = async () => {
      if (accountNumber.length === 10 && selectedBankCode) {
        if (developmentMode) {
          setAccountHolder(
            user?.contact_person_name || user?.business_name || ""
          );
          return;
        }
        try {
          const res = await resolveAccount(accountNumber, selectedBankCode);
          if (res.success) {
            setAccountHolder(res.data.account_name);
            console.log("Resolved Account Name:", res.data.account_name);
          } else {
            toast.error(res.message || "Failed to resolve account");
          }
        } catch (err: any) {
          console.log(err);
          toast.error("Error resolving account");
        }
      }
    };

    resolve();
  }, [accountNumber, selectedBankCode, user, developmentMode]);

  // Clear state when country changes
  useEffect(() => {
    setStateName("");
  }, [country]);

  // Check if draft exists on mount
  useEffect(() => {
    const draft = localStorage.getItem("kyc_draft");
    if (draft) {
      setHasDraft(true);
    }
  }, []);

  // Save draft manually
  const saveDraft = () => {
    try {
      const draftData = {
        businessDocUrl,
        ownerIdUrl,
        bankStatementUrl,
        businessName,
        businessType,
        registrationNumber,
        taxId,
        address1,
        address2,
        city,
        state: stateName,
        country,
        postalCode,
        bankName,
        accountHolder,
        accountNumber,
        certified,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("kyc_draft", JSON.stringify(draftData));
      setHasDraft(true);
      toast.success("Draft saved successfully!");
    } catch (err) {
      toast.error("Failed to save draft");
      console.error(err);
    }
  };

  // Load draft
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem("kyc_draft");
      if (draft) {
        const draftData = JSON.parse(draft);

        // Populate all fields
        setBusinessDocUrl(draftData.businessDocUrl || "");
        setOwnerIdUrl(draftData.ownerIdUrl || "");
        setBankStatementUrl(draftData.bankStatementUrl || "");
        setBusinessName(user?.business_name || "");
        setBusinessType(draftData.businessType || "");
        setRegistrationNumber(draftData.registrationNumber || "");
        setTaxId(draftData.taxId || "");
        setAddress1(draftData.address1 || "");
        setAddress2(draftData.address2 || "");
        setCity(draftData.city || "");
        setStateName(draftData.state || "");
        setCountry(draftData.country || "");
        setPostalCode(draftData.postalCode || "");
        setBankName(draftData.bankName || "");
        setBankSearch(draftData.bankName || ""); // Also set the search field to display the bank name
        setAccountHolder(draftData.accountHolder || "");
        setAccountNumber(draftData.accountNumber || "");
        setCertified(draftData.certified || false);

        toast.success("Draft loaded successfully!");
      }
    } catch (err) {
      toast.error("Failed to load draft");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchKyc = async () => {
      setLoading(true);
      try {
        const res = await getKycDetails();
        if (res.success === false) {
          // toast.error(res.message);
          console.log(res.message);
          setKycExists(false);
        } else if (res.data && res.data._id) {
          // KYC data exists in backend
          setKycExists(true);
          // Populate form fields
          setBusinessDocUrl(res.data.business_registration_document || "");
          setOwnerIdUrl(res.data.valid_owner_id || "");
          setBankStatementUrl(res.data.bank_statement || "");
          setBusinessName(user?.business_name || "");
          setBusinessType(res.data.business_type || "");
          setRegistrationNumber(res.data.registration_number || "");
          setTaxId(res.data.tax_identification_number || "");
          setAddress1(res.data.address_line_one || "");
          setAddress2(res.data.address_line_two || "");
          setCity(res.data.city || "");
          setStateName(res.data.state || "");
          setCountry(res.data.country || "");
          setPostalCode(res.data.postal_code || "");
          setBankName(res.data.bank_name || "");
          setBankSearch(res.data.bank_name || ""); // Also set the search field to display the bank name
          setAccountHolder(res.data.account_holder_name || "");
          setAccountNumber(res.data.account_number || "");
        } else {
          setKycExists(false);
        }
      } catch (err: any) {
        // toast.error(err?.message || "Failed to fetch KYC details");
        console.log(err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKyc();
  }, []);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "business" | "owner" | "bank"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading images...");
    setImageUploading(true);
    const url = await uploadToCloudinary(file);
    setLoading(false);

    if (url) {
      if (type === "business") setBusinessDocUrl(url);
      if (type === "owner") setOwnerIdUrl(url);
      if (type === "bank") setBankStatementUrl(url);
    }
    setImageUploading(false);
    toast.update(toastId, {
      render: "Image uploaded successfully!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
    setImageUploading(false);
  };

  const handleContinue = async () => {
    if (!businessDocUrl || !ownerIdUrl || !bankStatementUrl) {
      toast.error(
        "Please upload Business Registration, Owner ID and Bank Statement."
      );
      return;
    }

    // Validate required fields
    if (!businessType || !registrationNumber || !address1 || !city || !stateName || !country || !postalCode) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!bankName || !accountNumber || !accountHolder) {
      toast.error("Please fill in all bank details.");
      return;
    }

    // Save KYC data to localStorage for submission on Brand Profile page
    const kycData = {
      businessDocUrl,
      ownerIdUrl,
      bankStatementUrl,
      businessType,
      registrationNumber,
      taxId,
      address1,
      address2,
      city,
      stateName,
      country,
      postalCode,
      bankName,
      accountNumber,
      accountHolder,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("kyc_pending", JSON.stringify(kycData));
    toast.success("KYC details saved. Please complete your Brand Profile.");
    router.push("/brand-profile");
  };

  // Handle editing existing KYC
  const handleEdit = async () => {
    if (!businessDocUrl || !ownerIdUrl || !bankStatementUrl) {
      toast.error(
        "Please upload Business Registration, Owner ID and Bank Statement."
      );
      return;
    }

    if (!businessType || !registrationNumber || !address1 || !city || !stateName || !country || !postalCode) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!bankName || !accountNumber || !accountHolder) {
      toast.error("Please fill in all bank details.");
      return;
    }

    setUpdating(true);
    try {
      const res = await updateKyc(
        businessDocUrl,
        ownerIdUrl,
        bankStatementUrl,
        businessType,
        registrationNumber,
        taxId,
        address1,
        address2,
        city,
        stateName,
        country,
        postalCode,
        bankName,
        accountNumber,
        accountHolder
      );

      if (res?.success) {
        toast.success("KYC updated successfully!");

        // Refetch KYC data to confirm backend persisted the changes
        const refreshedKyc = await getKycDetails();
        if (refreshedKyc?.data) {
          setBusinessDocUrl(refreshedKyc.data.business_registration_document || "");
          setOwnerIdUrl(refreshedKyc.data.valid_owner_id || "");
          setBankStatementUrl(refreshedKyc.data.bank_statement || "");

          // Log to help debug if backend isn't persisting
          console.log("Refetched KYC data:", refreshedKyc.data);
        }
      } else {
        toast.error(res?.message || "Failed to update KYC");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full">
        <div className="w-full md:w-[600px] lg:w-[750px] ">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <BackButton />
              <div>
                <h1 className="text-black font-semibold text-xl">KYC Compliance</h1>
                <p className="text-gray-500 text-[13px] my-2">
                  Complete the following requirements to verify your business and
                  start selling on PALMODA
                </p>
              </div>
            </div>
          </div>
          <div className="border-2 border-gray-200 bg-white mt-5 p-4">
            <div className="flex justify-between mb-8 gap-2">
              <div>
                <h2 className="text-black font-semibold text-[14px]">
                  Business Verification
                </h2>
                <p className="text-gray-500 text-xs">
                  All fields marked with * are required
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
                <p className="text-black text-[13px]">Step 2 out of 3</p>
              </div>
            </div>
            <hr className="text-gray-200  mb-2" />
            {/* documents upload div */}
            <section className="flex flex-wrap items-center gap-5">
              <UploadBox
                isUploading={imageUploading}
                title="Business Registration Document"
                fileUrl={businessDocUrl}
                onUploadClick={() => businessInputRef.current?.click()}
                inputRef={businessInputRef}
                onFileChange={(e) => handleFileChange(e, "business")}
                status={kycExists ? businessDocStatus : undefined}
              />

              <UploadBox
                isUploading={imageUploading}
                title="Valid Owner ID (Passport/National ID/Driver's License)"
                fileUrl={ownerIdUrl}
                onUploadClick={() => ownerInputRef.current?.click()}
                inputRef={ownerInputRef}
                onFileChange={(e) => handleFileChange(e, "owner")}
                status={kycExists ? ownerIdStatus : undefined}
              />

              <UploadBox
                title="Utility Bill"
                isUploading={imageUploading}
                fileUrl={bankStatementUrl}
                onUploadClick={() => bankInputRef.current?.click()}
                inputRef={bankInputRef}
                onFileChange={(e) => handleFileChange(e, "bank")}
                status={kycExists ? bankStatementStatus : undefined}
              />
            </section>
            <hr className="text-gray-200 mt-2 mb-4" />
            {/* begining of business details 1 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="Business Name"
                  className="text-black font-semibold text-xs"
                >
                  Business Name *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter Legal Business Name"
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}
                    focus:ring-0`}
                  value={user?.business_name ?? ""}
                  disabled={isDisabled}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="Business Type"
                  className="text-black font-semibold text-xs"
                >
                  Business Type *
                </label>
                <select
                  name="business Type"
                  id=""
                  className="text-black p-1 text-sm border border-gray-300"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                >
                  <option value="">Select Business Type</option>
                  <option value="Fashion Brand / Designer">
                    Fashion Brand / Designer
                  </option>
                  <option value="Boutique / Store">Boutique / Store</option>
                  <option value="Online Thrift Seller">
                    Online Thrift Seller
                  </option>
                  <option value="Accessories Brand">Accessories Brand</option>
                  <option value="Footwear Retailer">Footwear Retailer</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="Registration Number"
                  className="text-black font-semibold text-xs"
                >
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  id="registrationNumber"
                  placeholder="Enter 9-digit Business Registration Number"
                  maxLength={9}
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  value={registrationNumber}
                  onChange={(e) => {
                    // Only allow numbers (0-9) and max 9 digits
                    const numericValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 9);
                    setRegistrationNumber(numericValue);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="Tax ID"
                  className="text-black font-semibold text-xs"
                >
                  Tax ID (optional)
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter tax identification number"
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </div>
            </section>
            <hr className="text-gray-200 my-4" />
            {/* end of business details 1 */}
            {/* start of business details 2 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="Address 1"
                  className="text-black font-semibold text-xs"
                >
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Street Address"
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="Address 2"
                  className="text-black font-semibold text-xs"
                >
                  Address Line 2{" "}
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Apt, suite, unit, etc (optional)"
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="Country"
                  className="text-black font-semibold text-xs"
                >
                  Country *
                </label>
                <select
                  name="country"
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map((countryOption) => (
                    <option key={countryOption} value={countryOption}>
                      {countryOption}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="State"
                  className="text-black font-semibold text-xs"
                >
                  State/Province *
                </label>
                {country && COUNTRY_STATES[country]?.length > 0 ? (
                  <select
                    name="state"
                    className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                      ${isDisabled ? "cursor-not-allowed" : ""}`}
                    disabled={isDisabled}
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  >
                    <option value="">Select State/Province</option>
                    {COUNTRY_STATES[country].map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter State/Province"
                    className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                      ${isDisabled ? "cursor-not-allowed" : ""}`}
                    disabled={isDisabled || !country}
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  />
                )}
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="City"
                  className="text-black font-semibold text-xs"
                >
                  City *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter city"
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="postal code"
                  className="text-black font-semibold text-xs"
                >
                  Postal Code *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter postal code"
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full relative">
                <label
                  htmlFor="bank name"
                  className="text-black font-semibold text-xs"
                >
                  Bank Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter bank name"
                  className="text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300"
                  value={bankSearch}
                  onChange={(e) => {
                    setBankSearch(e.target.value);
                    setShowBankDropdown(true);
                  }}
                  onFocus={() => setShowBankDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowBankDropdown(false), 200)
                  } // hide dropdown slightly after click
                />
                {/* Dropdown */}
                {showBankDropdown && bankResults.length > 0 && (
                  <ul className="absolute top-full mt-1 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto z-50 shadow-md">
                    {bankResults.map((bank) => (
                      <li
                        key={bank._id}
                        className="p-1 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setBankName(bank.bank_name); // display bank name
                          setBankSearch(bank.bank_name); // input field update
                          setSelectedBankCode(bank.bank_code); // store bank code
                          console.log("Selected Bank Code:", bank.bank_code);
                          setShowBankDropdown(false);
                        }}
                      >
                        {bank.bank_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="postal code"
                  className="text-black font-semibold text-xs"
                >
                  Account Number *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter bank account number"
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="bank holder name"
                  className="text-black font-semibold text-xs"
                >
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter account holder's name"
                  className={`text-black placeholder:text-gray-500 p-1 text-sm border border-gray-300
                    ${isDisabled ? "cursor-not-allowed" : ""}`}
                  disabled={isDisabled}
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                />
              </div>
            </section>
            {/* end of business details 2 */}
            <hr className="text-gray-200 my-2" />
            <div className="flex items-center gap-1.5 my-3.5">
              <input
                type="checkbox"
                checked={certified}
                onChange={(e) => setCertified(e.target.checked)}
                id="certifyCheckbox"
              />
              <label
                htmlFor="certifyCheckbox"
                className="text-xs text-gray-500"
              >
                I certify that all information provided is accurate and
                complete. I understand that providing false information may
                result in rejection of my vendor application.
              </label>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button className="bg-inherit border border-black text-black p-[5px] w-[120px] text-sm cursor-pointer">
                  Back
                </button>

                {/* Save Draft Button */}
                <button
                  className="bg-gray-200 border border-gray-300 text-black p-[5px] w-[120px] text-sm hover:bg-gray-300 cursor-pointer"
                  onClick={saveDraft}
                  type="button"
                  disabled={loading || isDisabled}
                >
                  Save Draft
                </button>

                {/* Load Draft Button - only shows if draft exists */}
                {hasDraft && (
                  <button
                    className="bg-black text-white p-[5px] w-[120px] text-sm cursor-pointer"
                    onClick={loadDraft}
                    type="button"
                    disabled={loading || isDisabled}
                  >
                    Load Draft
                  </button>
                )}
              </div>

              {/* Show Edit button if KYC exists, otherwise show Continue */}
              {kycExists ? (
                <button
                  className={`p-[5px] w-[120px] text-sm text-white ${
                    certified && !allKycApproved ? "bg-black cursor-pointer" : "bg-gray-400 cursor-not-allowed"
                  } ${isDisabled || allKycApproved ? "cursor-not-allowed" : ""} disabled:cursor-not-allowed`}
                  onClick={handleEdit}
                  type="button"
                  disabled={!certified || loading || updating || isDisabled || allKycApproved}
                >
                  {updating ? "Updating..." : "Edit"}
                </button>
              ) : (
                <button
                  className={`p-[5px] w-[120px] text-sm text-white ${
                    certified ? "bg-black cursor-pointer" : "bg-gray-400 cursor-not-allowed"
                  } ${isDisabled ? "cursor-not-allowed" : ""} disabled:cursor-not-allowed`}
                  onClick={handleContinue}
                  type="button"
                  disabled={!certified || loading || isDisabled || kycSubmitted}
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default Page;
