"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { fetchProducts, updateProduct } from "../../_lib/product";
import { toast } from "react-toastify";
import axios from "axios";
import { CategoryQueryParams } from "@/types";
import { useCategories } from "../../_lib/categories";
import { useSubCategories } from "../../_lib/subcategories";
import { useFetchGenders } from "../../_lib/gender";
import { useFetchSizes } from "../../_lib/sizes";
import { useFetchColors, addColor } from "../../_lib/colors";
import { Button } from "@heroui/button";
import { useParams, useRouter } from "next/navigation";

interface ProductType {
  _id: string;
  name: string;
  discounted_price: number;
  status: string;
  quantity: number;
  images: string[];
  sku: string;
  description: string;
  look_after_me: string;
  fabrics: string[];
  countries: [];
  colors: [];
  cost_price: number;
  categories: string[];
  sub_categories: string[];
  sizes: string[];
  gender: string[];
}

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
    } else {
      toast.error("Upload failed. Please try again.");
    }

    return null;
  }
};

function EditProductPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [materials, setMaterials] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [comparePrice, setComparePrice] = useState<number>(0);
  const [inventory, setInventory] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);
  const [showColorModal, setShowColorModal] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [addingColor, setAddingColor] = useState(false);
  const router = useRouter();

  const { _id } = useParams();

  const [queryParams] = useState<CategoryQueryParams>({
    page_number: 1,
    page_size: 100, // ✅ Increased to ensure we get all categories
    filter: {
      search_term: null,
      countries: {
        $in: [],
      },
    },
    sort_field: "name",
    sort_direction: 1,
  });

  // Fetch all data
  const { data: categoriesArray = [], isLoading: categoriesLoading } = useCategories(queryParams);
  const { data: subCategoriesArray = [], isLoading: subCategoryLoader } = useSubCategories();
  const { data: gendersArray = [], isLoading: genderLoading } = useFetchGenders();
  const { data: sizesArray = [], isLoading: sizesLoading } = useFetchSizes();
  const { data: colorsArray = [], isLoading: colorsLoader } = useFetchColors();

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetchProducts(1, 100);
        setProducts(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load product data");
      }
    };
    getProducts();
  }, []);

  // ✅ Populate form when product and all reference data are loaded
  useEffect(() => {
    if (!products.length || !_id) return;
    
    // Wait for all reference data to load before populating
    if (categoriesLoading || subCategoryLoader || genderLoading || sizesLoading || colorsLoader) {
      return;
    }

    const foundProduct = products.find((p) => p._id === _id);
    if (!foundProduct) {
      toast.error("Product not found");
      setProductLoading(false);
      return;
    }

    // ✅ Set basic fields
    setProductName(foundProduct.name);
    setSku(foundProduct.sku);
    setDescription(foundProduct.description);
    setCareInstructions(foundProduct.look_after_me);
    setMaterials(foundProduct.fabrics || []);
    setPrice(foundProduct.cost_price);
    setComparePrice(foundProduct.discounted_price);
    setInventory(foundProduct.quantity);
    setImages(foundProduct.images || []);

    // ✅ Set selections - these are already IDs, just verify they exist
    const categoryId = foundProduct.categories?.[0] || "";
    const subCategoryId = foundProduct.sub_categories?.[0] || "";
    const genderId = foundProduct.gender?.[0] || "";

    // Verify the IDs exist in the loaded data
    if (categoryId && categoriesArray?.some(cat => cat._id === categoryId)) {
      setSelectedCategory(categoryId);
    }
    
    if (subCategoryId && subCategoriesArray?.some(sub => sub._id === subCategoryId)) {
      setSelectedSubCategory(subCategoryId);
    }
    
    if (genderId && gendersArray?.some(gen => gen._id === genderId)) {
      setSelectedGender(genderId);
    }

    setColors(foundProduct.colors || []);
    setSizes(foundProduct.sizes || []);

    setProductLoading(false);
  }, [products, _id, categoriesArray, subCategoriesArray, gendersArray, categoriesLoading, subCategoryLoader, genderLoading, sizesLoading, colorsLoader]);

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
      render: "Image uploaded successfully!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
  };

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
    const toastId = toast.loading("Adding Color...");
    const res = await addColor(newColorName, newColorCode);

    if (res?.success) {
      toast.update(toastId, {
        render: "Color added successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setNewColorName("");
      setNewColorCode("");
      setShowColorModal(false);
    } else {
      toast.error(res?.message || "Failed to add color");
    }

    setAddingColor(false);
  };

  const handleUpdateProduct = async () => {
    if (
      !productName ||
      !selectedCategory ||
      !selectedSubCategory ||
      !selectedGender ||
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
      cost_price: price,
      description,
      genders: [selectedGender], // ✅ Use selectedGender state
      sizes,
      look_after_me: careInstructions,
      colors,
      fabrics: materials,
      discounted_price: comparePrice,
      countries: ["68fc2044c642a564a546feda"],
      quantity: inventory,
      sub_categories: [selectedSubCategory],
      categories: [selectedCategory],
    };

    try {
      const res = await updateProduct(productData, _id);

      if (res.success) {
        toast.success("Product updated successfully!");
        router.push("/"); // Redirect after successful update
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen px-4 md:px-8 py-6 w-full">
      <div className="w-full md:w-[600px] lg:w-[750px]">
        <div className="flex justify-between">
          <div>
            <h1 className="text-black font-semibold text-xl">
              Product Catalog Update
            </h1>
            <p className="text-gray-500 text-[13px] mb-2">
              Update your products to your inventory with detailed information
            </p>
          </div>
          <Link href="/">
            <button className="bg-black text-white px-3 py-2 text-xs rounded hover:bg-gray-800 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>

        <div className="border-2 border-gray-200 bg-white mt-5 p-4">
          {productLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-3/5 bg-gray-200 rounded"></div>
              <div className="h-6 w-2/5 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-32 bg-gray-200 rounded mt-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="Product Name" className="text-black font-semibold text-xs">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter Product Name"
                    className="text-gray-500 p-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                    disabled={true}
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
                    placeholder="Enter Unique Product Code"
                    className="text-gray-500 p-2 text-sm border disabled:cursor-not-allowed disabled:bg-gray-100 border-gray-300 focus:ring-2 focus:ring-black"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div className="flex flex-col gap-1.5 mb-4">
                  <label htmlFor="category" className="text-black font-semibold text-xs">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedSubCategory("");
                    }}
                    disabled={true}
                    className="border disabled:cursor-not-allowed disabled:bg-gray-100 border-gray-300 text-sm text-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">
                      {categoriesLoading ? "Loading..." : "-- Select Category --"}
                    </option>
                    {categoriesArray?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {/* {selectedCategory && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Selected: {categoriesArray?.find(c => c._id === selectedCategory)?.name}
                    </p>
                  )} */}
                </div>

                <div className="flex flex-col gap-1.5 mb-4">
                  <label htmlFor="subcategory" className="text-black font-semibold text-xs">
                    Subcategory *
                  </label>
                  <select
                    id="subcategory"
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    disabled={!selectedCategory || true}
                    className="border border-gray-300 text-sm text-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">
                      {subCategoryLoader ? "Loading..." : "-- Select Subcategory --"}
                    </option>
                    {subCategoriesArray?.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  {/* {selectedSubCategory && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Selected: {subCategoriesArray?.find(s => s._id === selectedSubCategory)?.name}
                    </p>
                  )} */}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="gender" className="text-black font-semibold text-xs">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    value={selectedGender}
                   disabled={true}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="border border-gray-300 text-sm text-gray-600
                     p-2 focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {genderLoading ? "Loading..." : "-- Select Gender --"}
                    </option>
                    {gendersArray?.map((gender) => (
                      <option key={gender._id} value={gender._id}>
                        {gender.name}
                      </option>
                    ))}
                  </select>
                  {selectedGender && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Selected: {gendersArray?.find(g => g._id === selectedGender)?.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex w-full my-2 flex-col gap-1.5">
                <label htmlFor="product-description" className="text-black font-semibold text-xs">
                  Product Description/Bio*
                </label>
                <textarea
                  id="product-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product in detail..."
                  className="w-full p-3 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-100 resize-none h-32"
                  disabled={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="materials" className="text-black font-semibold text-xs">
                    Materials/Fabric *
                  </label>
                  <input
                    type="text"
                    value={materials.join(", ")}
                    onChange={(e) => setMaterials(e.target.value.split(",").map((m) => m.trim()))}
                    placeholder="Cotton, Polyester, Silk etc."
                    className="text-gray-500 p-2 text-sm border border-gray-300 focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-100"
                    disabled={true}
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="care" className="text-black font-semibold text-xs">
                    Care Instructions
                  </label>
                  <input
                    type="text"
                    value={careInstructions}
                    onChange={(e) => setCareInstructions(e.target.value)}
                    placeholder="Machine wash cold, Dry clean only"
                    className="text-gray-500 p-2 text-sm border border-gray-300 focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:bg-gray-100"
                    disabled={true}
                  />
                </div>
              </div>

              <div className="mt-4">
                <h1 className="text-black text-sm font-semibold">Pricing & Inventory</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="price" className="text-black font-semibold text-xs">
                      Price (NGN)*
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="text-gray-500 p-2 text-sm border border-gray-300 focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="compare-price" className="text-black font-semibold text-xs">
                      Discount Price (NGN)
                    </label>
                    <input
                      type="number"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(Number(e.target.value))}
                      className="text-gray-500 p-2 text-sm border border-gray-300 focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="inventory" className="text-black font-semibold text-xs">
                      Inventory Quantity*
                    </label>
                    <input
                      type="number"
                      value={inventory}
                      onChange={(e) => setInventory(Number(e.target.value))}
                      className="text-gray-500 p-2 text-sm border border-gray-300 focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
              <hr className="text-gray-200 mt-2 mb-4" />

              <div>
                <h2 className="text-black text-sm font-semibold mb-2">Colors & Sizes</h2>
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">Available Colors</p>
                  <div className="flex gap-2 flex-wrap">
                    {colorsLoader && <Button isLoading>Loading</Button>}
                    {colorsArray?.map((color) => (
                      <button
                        key={color._id}
                        onClick={() => toggleSelection(color._id, colors, setColors)}
                        className={`border rounded-full w-7 h-7 ${
                          colors.includes(color._id) ? "ring-2 ring-black" : "border-gray-400"
                        }`}
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                      ></button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Available Sizes</p>
                  <div className="flex gap-2 flex-wrap">
                    {sizesArray?.map((size) => (
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

              <div>
                <h2 className="text-black text-sm font-semibold mb-2">Product Images</h2>
                <p className="text-xs text-gray-600 mb-2">
                  Upload high-quality images from multiple angles. First image will be used as the
                  main product image.
                </p>

                {imageUploading && <p className="text-sm text-blue-600">Uploading Images...</p>}

                <div className="flex flex-wrap gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-28 h-28 border rounded-md">
                      <img
                        src={img}
                        alt={`upload-${i}`}
                        className="object-cover w-full h-full rounded-md"
                      />
                      <button
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <label className="w-28 h-28 border-2 border-dashed border-gray-400 flex items-center px-3 justify-center text-gray-500 text-xs cursor-pointer rounded-md hover:bg-gray-100">
                    <div className="flex flex-col justify-center items-center">
                      <FaFileUpload className="text-gray-300 mb-2" />
                      <p className="text-gray-500 mb-2 text-xs">click to upload</p>
                      <p className="text-gray-500 mb-2 text-[10px] text-center">
                        JPG, PNG (Max 5MB)
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

              <div className="flex my-3 justify-end items-center gap-2">
                <button
                  onClick={() => router.push("/")}
                  className="bg-white border border-gray-300 text-black px-4 py-2 text-sm rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  disabled={loading}
                  className="bg-black text-white px-6 py-2 text-sm rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </>
          )}
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
              className="border border-gray-300 w-full p-2 mb-2 rounded-sm"
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

export default EditProductPage;