"use client";
import React, { useRef, useState, ChangeEvent, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa";
import ProtectedRoute from "../_components/ProtectedRoute";
import { completeKyc, getKycDetails  } from "../_lib/vendor";
import axios from "axios";
import { toast } from "react-toastify";
import UploadBox from "./Upload";


// Cloudinary config (same example cloud & preset you've used earlier)




const cloudName = "jokoyoski"; 
const uploadPreset = "jokoyoski";


const uploadToCloudinary = async (file: File): Promise<string | null> => {
  try {
    // Validate file size (5MB max)
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
    
    // More specific error messages
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

  // refs for hidden file inputs (keeps UI identical)
  const businessInputRef = useRef<HTMLInputElement | null>(null);
  const ownerInputRef = useRef<HTMLInputElement | null>(null);
  const bankInputRef = useRef<HTMLInputElement | null>(null);

  // your original form fields (state only, no markup changes)
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
  

   useEffect(() => {
    const fetchKyc = async () => {
      setLoading(true);
      try {
        const res = await getKycDetails();
        console.log(res);
        if (res.success === false) {
          toast.error(res.message);
        } else {
          // Populate form fields
          setBusinessDocUrl(res.data.business_registration_document || "");
          setOwnerIdUrl(res.data.valid_owner_id || "");
          setBankStatementUrl(res.data.bank_statement || "");
          setBusinessName(res.data.business_name || "");
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
          setAccountHolder(res.data.account_holder_name || "");
          setAccountNumber(res.data.account_number || "");
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch KYC details");
      } finally {
        setLoading(false);
      }
    };

    fetchKyc();
  }, []);

  // handle file selection -> upload -> set URL
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: "business" | "owner" | "bank") => {
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
      toast.success("Upload successful");
    }
    setImageUploading(false);
        toast.update(toastId, {
        render: "Images uploaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
       setImageUploading(false);      
  };

  // Continue button handler — sends the URLs + fields to completeKyc
  const handleContinue = async () => {
    // basic checks — preserve original UI/labels, only add these runtime checks
    if (!businessDocUrl || !ownerIdUrl || !bankStatementUrl) {
      toast.error("Please upload Business Registration, Owner ID and Bank Statement.");
      return;
    }

    setLoading(true);
    try {
      const res = await completeKyc(
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
        toast.success("KYC completed successfully");
      } else {
        // backend may return { success: false, message }
        toast.error(res?.message || "KYC failed");
        console.log(res?.message)
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full">
        <div className="w-full md:w-[600px] lg:w-[750px] ">
          <h1 className="text-black font-semibold text-xl">KYC Compliance</h1>
          <p className="text-gray-500 text-[13px] my-2">Complete the following requirements to verify your business and start selling on PALMODA</p>
          <div className="border-2 border-gray-200 bg-white mt-5 p-4">
            <div className="flex justify-between mb-8 gap-2">
              <div>
                <h2 className="text-black font-semibold text-[14px]">Business Verification</h2>
                <p className="text-gray-500 text-xs">All fields marked with * are required</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
                <p className="text-black text-[13px]">Step 2 out of 3</p>
              </div>
            </div>
            <hr className="text-gray-200  mb-2"/>
            {/* documents upload div */}
            <section className="flex flex-wrap items-center gap-5">
              {/* begining of business reg doc */}
            <UploadBox
            isUploading={imageUploading}
  title="Business Registration Document"
  fileUrl={businessDocUrl}
  onUploadClick={() => businessInputRef.current?.click()}
  inputRef={businessInputRef}
  onFileChange={(e) => handleFileChange(e, "business")}
/>

              {/* ending of business reg doc */}
              {/* begining of owner id  */}
              {/* ending of owner id */}
              {/* begining of bank statement */}
              <UploadBox
            isUploading={imageUploading}

  title="Valid Owner ID (Passport/National ID/Driver’s License)"
  fileUrl={ownerIdUrl}
  onUploadClick={() => ownerInputRef.current?.click()}
  inputRef={ownerInputRef}
  onFileChange={(e) => handleFileChange(e, "owner")}
/>

<UploadBox
  title="Bank Statement"
            isUploading={imageUploading}

  fileUrl={bankStatementUrl}
  onUploadClick={() => bankInputRef.current?.click()}
  inputRef={bankInputRef}
  onFileChange={(e) => handleFileChange(e, "bank")}
/>

              {/* ending of bank statement */}
            </section>
            {/* end of documents upload div */}
            <hr className="text-gray-200 mt-2 mb-4"/>
            {/* begining of business details 1 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="Business Name" className="text-black font-semibold text-xs">Business Name *</label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter Legal Business Name"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="Business Type" className="text-black font-semibold text-xs">Business Type  *</label>
                <select
                  name="business Type"
                  id=""
                  className="text-black p-1 text-sm border border-gray-300"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                >
                  <option value="">Select Business Type</option>
                  <option value="Fashion Brand / Designer">Fashion Brand / Designer</option>
                  <option value="Boutique / Store">Boutique / Store</option>
                  <option value="Online Thrift Seller">Online Thrift Seller</option>
                  <option value="Accessories Brand">Accessories Brand</option>
                  <option value="Footwear Retailer">Footwear Retailer</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="Registration Number" className="text-black font-semibold text-xs">Registration Number *</label>
                <input
                  type="number"
                  name=""
                  id=""
                  placeholder="Enter Business Registration Number"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="Tax ID" className="text-black font-semibold text-xs">Tax ID (optional) *</label>
                <input
                  type="number"
                  name=""
                  id=""
                  placeholder="Enter tax identification number"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                />
              </div>
            </section>
            <hr className="text-gray-200 my-4"/>
            {/* end of business details 1 */}
            {/* start of business details 2 */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="Address 1" className="text-black font-semibold text-xs">Address Line 1 *</label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Street Address"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="Address 2" className="text-black font-semibold text-xs">Address Line 2 </label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Apt, suite, unit, etc (optional)"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="City" className="text-black font-semibold text-xs">City *</label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter city"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="State" className="text-black font-semibold text-xs">State/Province *</label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter state"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="postal code" className="text-black font-semibold text-xs">Postal Code *</label>
                <input
                  type="number"
                  name=""
                  id=""
                  placeholder="Enter postal code"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="Country" className="text-black font-semibold text-xs">Country *</label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter Country"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="bank name" className="text-black font-semibold text-xs">Bank Name *</label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter bank name"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="bank holder name" className="text-black font-semibold text-xs">Account Holder Name *</label>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter account holder's name"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="postal code" className="text-black font-semibold text-xs">Account Number *</label>
                <input
                  type="number"
                  name=""
                  id=""
                  placeholder="Enter bank account number"
                  className="text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>
            </section>
            {/* end of business details 2 */}
            <hr className="text-gray-200 my-2"/>
            <div className="flex items-center gap-1.5 my-3.5">
  <input
    type="checkbox"
    checked={certified}
    onChange={(e) => setCertified(e.target.checked)}
    id="certifyCheckbox"
  />
  <label htmlFor="certifyCheckbox" className="text-xs text-gray-500">
    I certify that all information provided is accurate and complete. I understand that providing false information may result in rejection of my vendor application.
  </label>
</div>

            <div className="flex justify-between items-center">
              <button className="bg-inherit border border-black text-black p-[5px] w-[120px] text-sm">Back</button>
              <button
  className={`p-[5px] w-[120px] text-sm text-white ${
    certified ? "bg-black" : "bg-gray-400 cursor-not-allowed"
  }`}
  onClick={handleContinue}
  type="button"
  disabled={!certified || loading}
>
  {loading ? "Submitting..." : "Continue"}
</button>

            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default Page;
