"use client";
import React, { useRef, useState, ChangeEvent, useEffect } from "react";
import {
  FaFacebook,
  FaFileUpload,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import { RiPlanetFill } from "react-icons/ri";
import { BiSolidInfoCircle } from "react-icons/bi";
import BrandUploadBox from "./BrandUploadBox";
import { toast } from "react-toastify";
import axios from "axios";
import {
  setUpBrandProfile,
  getBrandDetails,
  updateBrandDetails,
} from "../_lib/brand";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../_lib/AuthContext";

const cloudName = "jokoyoski";
const uploadPreset = "jokoyoski";

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
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data?.secure_url ?? null;
  } catch (e: any) {
    console.error("Cloudinary upload error:", e);
    toast.error(
      e.response?.data?.error?.message || "Upload failed. Please try again."
    );
    return null;
  }
};

const BrandProfilePage = () => {
  const [logoBlackUrl, setLogoBlackUrl] = useState("");
  const [logoWhiteUrl, setLogoWhiteUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [pinterest, setPinterest] = useState("");
  const [brandExists, setBrandExists] = useState(false);
  const [tiktok, setTiktok] = useState("");
  const [website, setWebsite] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
  const isDisabled =
    user?.is_bank_information_verified ||
    user?.is_business_verified ||
    user?.is_identity_verified;

  const logoBlackRef = useRef<HTMLInputElement | null>(null);
  const logoWhiteRef = useRef<HTMLInputElement | null>(null);
  const bannerRef = useRef<HTMLInputElement | null>(null);

  // Check if draft exists on mount
  useEffect(() => {
    const draft = localStorage.getItem('brand_draft');
    if (draft) {
      setHasDraft(true);
    }
  }, []);

  // Save draft manually
  const saveDraft = () => {
    try {
      const draftData = {
        logoBlackUrl,
        logoWhiteUrl,
        bannerUrl,
        brandName,
        brandDescription,
        instagram,
        facebook,
        twitter,
        pinterest,
        tiktok,
        website,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('brand_draft', JSON.stringify(draftData));
      setHasDraft(true);
      toast.success('Draft saved successfully!');
    } catch (err) {
      toast.error('Failed to save draft');
      console.error(err);
    }
  };

  // Load draft
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem('brand_draft');
      if (draft) {
        const draftData = JSON.parse(draft);
        
        // Populate all fields
        setLogoBlackUrl(draftData.logoBlackUrl || "");
        setLogoWhiteUrl(draftData.logoWhiteUrl || "");
        setBannerUrl(draftData.bannerUrl || "");
        setBrandName(draftData.brandName || "");
        setBrandDescription(draftData.brandDescription || "");
        setInstagram(draftData.instagram || "");
        setFacebook(draftData.facebook || "");
        setTwitter(draftData.twitter || "");
        setPinterest(draftData.pinterest || "");
        setTiktok(draftData.tiktok || "");
        setWebsite(draftData.website || "");
        
        toast.success('Draft loaded successfully!');
      }
    } catch (err) {
      toast.error('Failed to load draft');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchBrand = async () => {
      setLoading(true);
      try {
        const res = await getBrandDetails();

        if (
          res.success === false ||
          !res.data ||
          Object.keys(res.data).length === 0
        ) {
          setBrandExists(false);
        } else {
          const data = res.data;
          setBrandName(data.brand_name || "");
          setBrandDescription(data.brand_description || "");
          setLogoBlackUrl(data.brand_logo_black || "");
          setLogoWhiteUrl(data.brand_logo_white || "");
          setBannerUrl(data.brand_banner || "");
          setInstagram(data.instagram_handle || "");
          setFacebook(data.facebook_handle || "");
          setTwitter(data.twitter_handle || "");
          setPinterest(data.pinterest_handle || "");
          setTiktok(data.tiktok_handle || "");
          setWebsite(data.website_url || "");

          setBrandExists(true);
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch brand details");
        setBrandExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, []);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "logoBlack" | "logoWhite" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading images...");

    const url = await uploadToCloudinary(file);
    if (!url) return;

    if (type === "logoBlack") setLogoBlackUrl(url);
    if (type === "logoWhite") setLogoWhiteUrl(url);
    if (type === "banner") setBannerUrl(url);

    toast.update(toastId, {
          render: "Image uploaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
  };

  const handleCreate = async () => {
    if (
      !brandName ||
      !brandDescription ||
      !logoBlackUrl ||
      !logoWhiteUrl ||
      !bannerUrl
    ) {
      toast.error("Please fill in all required fields and upload images.");
      return;
    }

    setCreating(true);
    try {
      const res = await setUpBrandProfile(
        brandName,
        brandDescription,
        logoBlackUrl,
        logoWhiteUrl,
        bannerUrl,
        instagram,
        facebook,
        twitter,
        website,
        tiktok,
        pinterest
      );

      if (!res.success) {
        toast.error(res.message || "Failed to create brand profile");
        return;
      }

      toast.success("Brand Profile has been submitted for review");
      // Clear draft after successful submission
      localStorage.removeItem('brand_draft');
      setHasDraft(false);
      setBrandExists(true);
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (
      !brandName ||
      !brandDescription ||
      !logoBlackUrl ||
      !logoWhiteUrl ||
      !bannerUrl
    ) {
      toast.error("Please fill in all required fields and upload images.");
      return;
    }

    setLoading(true);
    try {
      const res = await updateBrandDetails(
        brandName,
        brandDescription,
        logoBlackUrl,
        logoWhiteUrl,
        bannerUrl,
        instagram,
        facebook,
        twitter,
        website,
        tiktok,
        pinterest
      );

      if (!res.success) {
        toast.error(res.message || "Failed to update brand profile");
        return;
      }

      toast.success("Brand profile updated successfully!");
      // Clear draft after successful update
      localStorage.removeItem('brand_draft');
      setHasDraft(false);
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full">
      <div className="w-full md:w-[600px] lg:w-[750px]">
        <h1 className="text-black font-semibold text-xl">
          Brand Profile Setup
        </h1>
        <p className="text-gray-500 text-[13px] mt-2 mb-5">
          Create your brand's presence on PALMODA. This information will be
          visible to customers.
        </p>

        <hr className="text-gray-200 mb-3.5" />

        {/* Brand Name */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-black font-semibold text-xs">
            Brand Name*
          </label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Enter brand name"
            disabled={isDisabled}
            className={`p-[5px] text-black border border-gray-200 text-xs ${isDisabled ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Brand Description */}
        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-black font-semibold text-xs">
            Brand Description/Bio*
          </label>
          <textarea
            value={brandDescription}
            onChange={(e) => setBrandDescription(e.target.value)}
            placeholder="Tell us about your brand, philosophy, and what makes you unique"
            disabled={isDisabled}
            className={`w-full p-3 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none h-32 
              ${isDisabled ? "cursor-not-allowed" : ""}`}
          />
          <p className="text-xs text-gray-500">
            Minimum 100 characters, maximum 500 characters
          </p>
        </div>

        <hr className="text-gray-200 my-5" />

        {/* Upload Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BrandUploadBox
            title="Brand Logo (Black Version)*"
            fileUrl={logoBlackUrl}
            onUploadClick={() => logoBlackRef.current?.click()}
            inputRef={logoBlackRef}
            onFileChange={(e) => handleFileChange(e, "logoBlack")}
            minSize="JPG or PNG, 500x500 minimum"
          />

          <BrandUploadBox
            title="Brand Logo (White Version)*"
            fileUrl={logoWhiteUrl}
            onUploadClick={() => logoWhiteRef.current?.click()}
            inputRef={logoWhiteRef}
            onFileChange={(e) => handleFileChange(e, "logoWhite")}
            minSize="JPG or PNG, 500x500 minimum"
            bgColor="bg-gray-900"
            textColor="text-white"
          />

          <BrandUploadBox
            title="Brand Banner (Hero Image)*"
            fileUrl={bannerUrl}
            onUploadClick={() => bannerRef.current?.click()}
            inputRef={bannerRef}
            onFileChange={(e) => handleFileChange(e, "banner")}
            minSize="JPG or PNG, 1140x480 recommended"
            height="h-40"
          />
        </div>

        <hr className="text-gray-200 my-5" />

        {/* Social Media Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: "Instagram",
              icon: <FaInstagram />,
              value: instagram,
              setter: setInstagram,
              placeholder: "@yourbrandname",
            },
            {
              label: "Facebook",
              icon: <FaFacebook />,
              value: facebook,
              setter: setFacebook,
              placeholder: "facebook.com/yourbrandname",
            },
            {
              label: "Twitter",
              icon: <FaTwitter />,
              value: twitter,
              setter: setTwitter,
              placeholder: "@yourbrandname",
            },
            {
              label: "Pinterest",
              icon: <FaPinterest />,
              value: pinterest,
              setter: setPinterest,
              placeholder: "pinterest.com/yourbrandname",
            },
            {
              label: "Tiktok",
              icon: <FaTiktok />,
              value: tiktok,
              setter: setTiktok,
              placeholder: "@yourbrandname",
            },
            {
              label: "Website",
              icon: <RiPlanetFill />,
              value: website,
              setter: setWebsite,
              placeholder: "https://yourbrand.com",
            },
          ].map((input, idx) => (
            <div className="flex flex-col gap-1.5 w-full" key={idx}>
              <label className="text-black font-semibold text-xs">
                {input.label}
              </label>
              <div className="relative w-full">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                  {input.icon}
                </div>
                <input
                  type="text"
                  value={input.value}
                  onChange={(e) => input.setter(e.target.value)}
                  placeholder={input.placeholder}
                  disabled={isDisabled}
                  className={`pl-8 text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0 w-full
                     ${isDisabled ? "cursor-not-allowed" : ""}
                  `}
                />
              </div>
            </div>
          ))}
        </div>

        <hr className="text-gray-200 my-5" />

        {/* Actions */}
        <div className="flex justify-between items-center my-3">
          <div className="flex gap-2">
            <button 
              className="bg-gray-200 border border-gray-300 text-black p-[5px] w-[120px] text-sm hover:bg-gray-300"
              onClick={saveDraft}
              type="button"
              disabled={loading || creating || isDisabled}
            >
              {hasDraft ? "Update Draft" : "Save Draft"}
            </button>

            {/* Load Draft Button - only shows if draft exists */}
            {hasDraft && (
              <button
                className="bg-black text-white p-[5px] w-[120px] text-sm "
                onClick={loadDraft}
                type="button"
                disabled={loading || creating || isDisabled}
              >
                Load Draft
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="bg-inherit border border-black text-black p-[5px] w-[120px] text-sm"
            >
              Back
            </button>

            {!brandExists && (
              <button
                onClick={handleCreate}
                className="bg-black text-white p-[5px] w-[120px] text-sm flex justify-center items-center"
                disabled={creating || loading || isDisabled}
              >
                {creating ? "Loading..." : "Create"}
              </button>
            )}

            {brandExists && (
              <button
                onClick={handleUpdate}
                className='bg-black text-white p-[5px] w-[120px] text-sm flex justify-center items-center'
                disabled={loading || creating || isDisabled}
              >
                {loading ? "Loading..." : "Update"}
              </button>
            )}
          </div>
        </div>

        <hr className="text-gray-200 my-5" />

        {/* Info */}
        <div className="flex justify-between items-start my-3">
          <div className="flex items-start gap-1 text-xs text-gray-500">
            <BiSolidInfoCircle />
            <p>Need help setting up your brand profile? View our guide</p>
          </div>
          {/* <Link href="/" className="text-black font-semibold text-sm">
            Skip for now
          </Link> */}
        </div>
      </div>
    </section>
  );
};

export default BrandProfilePage;