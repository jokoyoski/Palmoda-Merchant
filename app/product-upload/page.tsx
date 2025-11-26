"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { createProduct } from "../_lib/product";
import { toast } from "react-toastify";
import axios from "axios";
import { CategoryQueryParams } from "@/types";
import { useCategories } from "../_lib/categories";
import { useSubCategories } from "../_lib/subcategories";
import { useFetchGenders } from "../_lib/gender";
import { useFetchSizes } from "../_lib/sizes";
import { useFetchColors, addColor } from "../_lib/colors";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

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

function page() {
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [materials, setMaterials] = useState("");
  const [price, setPrice] = useState("");
const [comparePrice, setComparePrice] = useState("");
  const [inventory, setInventory] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [addingColor, setAddingColor] = useState(false);
  const router = useRouter();

  // Category and subcategory data
  const categories: Record<string, string[]> = {
    Clothing: ["T-Shirts", "Jeans", "Dresses", "Jackets", "Sweaters"],
    Bags: ["Handbags", "ToteBags", "Backpacks", "Clutches"],
    Footwear: ["Sneakers", "Sandals", "Boots", "Heels"],
    Beauty: ["Makeup", "Skincare", "Fragrance"],
  };

  // Map gender labels to backend IDs
  const genderOptions = [
    { label: "Select Gender", value: "" }, // default placeholder
    { label: "Male", value: "691b26cc3ef7db6e39a860d2" },
    { label: "Female", value: "691b26bf3ef7db6e39a860d1" },
    // Optionally, you can add Unisex if your backend supports it
  ];

  // Get the subcategories based on selected category
  const subCategories = selectedCategory ? categories[selectedCategory] : [];

  const availableColors: string[] = ["Black", "White", "Blue", "Red", "Green"];

  // ✅ fix #1: add proper event type
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const toastId = toast.loading("Uploading images...");
    setImageUploading(true);

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const url = await uploadToCloudinary(file);
      if (url) uploadedUrls.push(url);
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setImageUploading(false);
    toast.update(toastId, {
      render: "Images uploaded successfully!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  };

  const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
    page_number: 1,
    page_size: 10,
    filter: {
      search_term: null,
      countries: {
        $in: [],
      },
    },
    sort_field: "name",
    sort_direction: 1,
  });

  const {
    data: categoriesArray = [],
    isLoading,
    isError,
    error,
  } = useCategories(queryParams);

  const {
    data: subCategoriesArray = [],
    isLoading: subCategoryLoader,
    isError: subCategoryIsError,
    error: subCategoryError,
  } = useSubCategories();

  const {
    data: gendersArray = [],
    isLoading: genderLoading,
    isError: isGenderError,
    error: genderError,
  } = useFetchGenders();

  const {
    data: sizesArray = [],
    isLoading: sizesLoading,
    isError: sizesIsError,
    error: sizesError,
  } = useFetchSizes();

  const {
    data: colorsArray = [],
    isLoading: colorsLoader,
    isError: colorIsError,
    error: colorError,
  } = useFetchColors();
  // complete fetch categories

  // ✅ fix #3: strongly type list arguments
  const toggleSelection = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddColor = async () => {
    if (!newColorName || !newColorCode) {
      toast.error("Please enter both color name and code");
      return;
    }

    setAddingColor(true);

    const res = await addColor(newColorName, newColorCode);

    if (res?.success) {
      toast.success("Color added successfully!");

      // reset modal
      setNewColorName("");
      setNewColorCode("");
      setShowColorModal(false);

      // refresh colors list
      router.push("/");
    } else {
      toast.error(res?.message || "Failed to add color");
    }

    setAddingColor(false);
  };

  const formatMoney = (value: string) => {
    if (!value) return "0.00";
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const handleCreateProduct = async () => {
    if (
      !productName ||
      !selectedCategory ||
      !selectedSubCategory ||
      !gender ||
      !description ||
      !inventory ||
      !price
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    const productData = {
      name: productName,
      images,
      cost_price: parseFloat(price),
      description,
      genders: [gender],
      sizes,
      look_after_me: careInstructions,
      colors,
      fabrics: [materials],
      discounted_price: parseFloat(comparePrice),
      countries: ["68fc2044c642a564a546feda"],
      quantity: inventory,
      sub_categories: [selectedSubCategory],
      categories: [selectedCategory],
    };

    const res = await createProduct(productData);

    if (res.success) {
      toast.success("Product created successfully!");
      // Reset form or redirect
    } else {
      toast.error(res.message);
      console.log(res.message);
    }

    setLoading(false);
  };

  return (
    <section className="bg-gray-100 min-h-screen px-4  md:px-8 py-6 w-full">
      <div className="w-full md:w-[600px] lg:w-[750px] ">
        <div className="flex justify-between">
          <div>
            <h1 className="text-black font-semibold text-xl">
              Product Catalog Upload
            </h1>
            <p className="text-gray-500 text-[13px] mb-2">
              Add new products to your inventory with detailed information
            </p>
          </div>
          <Link href="/">
            <button className="bg-black  text-white p-[5px] w-fit text-xs">
              Back to Dashboard
            </button>
          </Link>
        </div>
        <div className="border-2 border-gray-200 bg-white mt-5 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="Product Name"
                className="text-black font-semibold text-xs"
              >
                Product Name *
              </label>
              <input
                type="text"
                name=""
                id=""
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter  Product Name"
                className="
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="SKU" className="text-black font-semibold text-xs">
                SKU *
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                name=""
                id=""
                placeholder="Enter Unique Product Code"
                className="
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            <div className="flex flex-col gap-1.5 mb-4">
              <label
                htmlFor="category"
                className="text-black font-semibold text-xs"
              >
                Category *
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory(""); // Reset subcategory on category change
                }}
                className="border border-gray-300 text-sm text-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">
                  {isLoading ? "Loading..." : "-- Select Category --"}
                </option>
                {categoriesArray &&
                  categoriesArray.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              <label
                htmlFor="subcategory"
                className="text-black font-semibold text-xs"
              >
                Subcategory *
              </label>
              <select
                id="subcategory"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={!selectedCategory}
                className={`border border-gray-300 text-sm text-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-black ${
                  !selectedCategory ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">
                  {subCategoryLoader
                    ? "Loading..."
                    : "-- Select Subcategory --"}
                </option>
                {subCategoriesArray.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            {/* gender radio inputs, male female, unisex */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="gender"
                className="text-black font-semibold text-xs"
              >
                Gender *
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border border-gray-300 text-sm text-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">
                  {genderLoading ? "Loading..." : "-- Select Gender --"}
                </option>
                {gendersArray.map((gender) => (
                  <option key={gender._id} value={gender._id}>
                    {gender.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex w-full my-2 flex-col gap-1.5">
            <label
              htmlFor="product-description"
              className="text-black font-semibold text-xs"
            >
              Product Description/Bio*
            </label>
            <textarea
              id="product-description"
              name="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product in detail including key features, benefits, and unique selling points.."
              className="w-full p-3 text-sm text-black border border-gray-300 rounded-md
     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none h-32"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="materials"
                className="text-black font-semibold text-xs"
              >
                Materials/Fabric *
              </label>
              <input
                type="text"
                name=""
                id=""
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="Cotton, Polyster, Silk etc."
                className="
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="care"
                className="text-black font-semibold text-xs"
              >
                Care Instructions
              </label>
              <input
                type="text"
                name=""
                id=""
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                placeholder="Machine wash cold, Dry clean only"
                className="
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
              />
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-black text-sm font-semibold">
              Pricing & Inventory
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="price"
                  className="text-black font-semibold text-xs"
                >
                  Price (NGN)*
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={() => setPrice(formatMoney(price))}
                  className="text-gray-500 p-1 text-sm border border-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="compare-price"
                  className="text-black font-semibold text-xs"
                >
                  Discount Price (NGN)
                </label>
                <input
                  type="text"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  onBlur={() => setComparePrice(formatMoney(comparePrice))}
                  className="text-gray-500 p-1 text-sm border border-gray-300"
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="inventory"
                  className="text-black font-semibold text-xs"
                >
                  Inventory Quantity*
                </label>
                <input
                  type="number"
                  name=""
                  id=""
                  value={inventory}
                  onChange={(e) => setInventory(Number(e.target.value))}
                  className="
             text-gray-500 p-1 text-sm border border-gray-300 focus:ring-0"
                />
              </div>
            </div>
          </div>
          <hr className="text-gray-200 mt-2 mb-4" />

          <div>
            <h2 className="text-black text-sm font-semibold mb-2">
              Colors & Sizes
            </h2>
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-1">Available Colors</p>
              <div className="flex gap-2 flex-wrap">
                {colorsLoader && <Button isLoading>Loading</Button>}
                {colorsArray.map((color) => (
                  <button
                    key={color._id}
                    onClick={() =>
                      toggleSelection(color._id, colors, setColors)
                    }
                    className={`border rounded-full w-7 h-7 ${
                      colors.includes(color._id)
                        ? "ring-2 ring-black"
                        : "border-gray-400"
                    }`}
                    style={{ backgroundColor: color.code }}
                  ></button>
                ))}
                {/* Hide Color Add Button */}
                {/* <button
                  onClick={() => setShowColorModal(true)}
                  className="w-7 h-7 rounded-full border border-gray-400 flex items-center 
                 justify-center text-black text-lg font-semibold hover:bg-gray-200"
                >
                  +
                </button> */}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">Available Sizes</p>
              <div className="flex gap-2 flex-wrap">
                {sizesArray.map((size) => (
                  <button
                    key={size._id}
                    onClick={() => toggleSelection(size._id, sizes, setSizes)}
                    className={`border text-xs px-2 py-1 rounded ${
                      sizes.includes(size._id)
                        ? "bg-black text-white"
                        : "bg-white text-black border-gray-400"
                    }`}
                  >
                    {size.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <hr className="text-gray-200 mt-4 mb-4" />
          {/* Product Images */}
          <div>
            <h2 className="text-black text-sm font-semibold mb-2">
              Product Images
            </h2>
            <p className="text-xs text-gray-600 mb-2">
              Upload high-quality images from multiple angles. First image will
              be used as the main product image.
            </p>

            {imageUploading && <p>Uploading Images...</p>}

            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-28 h-28 border rounded-md">
                  <img
                    src={img}
                    alt={`upload-${i}`}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
              ))}

              <label
                className="w-28 h-28 border-2
               border-dashed border-gray-400 flex items-center px-3 justify-center text-gray-500 text-xs cursor-pointer rounded-md hover:bg-gray-100"
              >
                <div className="flex flex-col justify-center items-center">
                  <FaFileUpload className="text-gray-300 mb-2" />
                  <p className="text-gray-500 mb-2 text-xs">click to upload</p>
                  <p className="text-gray-500 mb-2 text-[10px] text-center">
                    Accepted formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex my-3 justify-between items-center">
            <button className="bg-inherit border border-black text-black p-[5px] w-[120px] text-sm">
              Save as Draft
            </button>
            <div className="flex items-center gap-2">
              <button className="bg-inherit border border-black text-black p-[5px] w-[120px] text-sm">
                Preview Product
              </button>
              <button
                onClick={handleCreateProduct}
                disabled={loading}
                className="bg-black text-white p-[5px] w-[120px] text-sm"
              >
                {loading ? "Publishing..." : "Publish Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showColorModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-md w-[300px] shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Add New Color</h2>

            <input
              type="text"
              placeholder="Color Name"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              className="border border-gray-300 w-full p-2 mb-2  rounded-sm"
            />

            <input
              type="text"
              placeholder="Color Hex Code (#000000)"
              value={newColorCode}
              onChange={(e) => setNewColorCode(e.target.value)}
              className="border border-gray-300 w-full p-2 mb-4 rounded-sm"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowColorModal(false)}
                className="px-3 py-1 border border-gray-500 text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleAddColor}
                disabled={addingColor}
                className="px-3 py-1 bg-black text-white"
              >
                {addingColor ? "Adding..." : "Add Color"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default page;
