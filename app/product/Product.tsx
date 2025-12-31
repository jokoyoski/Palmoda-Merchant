import React, { useState } from "react";
import { Product } from "../_lib/type";
import { useFetchColors } from "../_lib/colors";
import { useFetchSizes } from "../_lib/sizes";
import { useFetchGenders } from "../_lib/gender";
import { useCategories } from "../_lib/categories";
import { CategoryQueryParams } from "@/types";
import { CiUser } from "react-icons/ci";

interface ProductProps {
  product: Product;
}

function ProductComponent({ product }: ProductProps) {
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [gender, setGender] = useState<string[]>([]);
  const [currentMainImage, setCurrentMainImage] = useState(product.images[0]);

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

  const mapIdsToNames = (
    ids: string[],
    referenceArray: { _id: string; name: string }[]
  ) => {
    return (
      ids
        .map((id) => referenceArray.find((ref) => ref._id === id)?.name)
        .filter(Boolean)
        .join(", ") || "N/A"
    );
  };

  // For fabrics/materials
  const formatFabrics = (fabrics: string[]) => fabrics?.join(", ") || "N/A";

  return (
    <section className="bg-white px-4 mt-3.5 py-3">
      <div className="p-3 border border-gray-200 mb-4">
        <div className="flex justify-between items-center">
          <h1></h1>
          {product?.status === "Approved" && (
            <h3 className="text-green-500 font-semibold text-xs">Approved</h3>
          )}

          {product?.status === "Rejected" && (
            <h3 className="text-red-500 font-semibold text-xs">Rejected</h3>
          )}

          {product?.status !== "Approved" && product?.status !== "Rejected" && (
            <h3 className="text-yellow-600 font-semibold text-xs">
              Pending Approval
            </h3>
          )}
        </div>

        {/* Product Details */}
        <div className="flex gap-7">
          <div className="flex flex-col gap-6 w-[250px]">
            <img
              src={currentMainImage}
              alt="Main Product"
              className="w-full h-[300px] object-cover rounded-md"
            />

            <div className="flex gap-1">
              {product.images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-1/4 h-[50px] object-cover rounded-sm cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setCurrentMainImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="w-full">
            <h1 className="text-sm font-semibold text-black">{product.name}</h1>
            <div className="flex items-center gap-4 my-3.5">
              <h3 className="text-xl font-semibold text-black">
                ₦{(product.discounted_price ?? product.cost_price).toLocaleString()}
              </h3>
              <h4 className="text-gray-500 text-sm line-through">
                ₦{product.cost_price.toLocaleString()}
              </h4>
            </div>
            <div className="flex gap-12">
              <div className="flex flex-col gap-3">
                <h1 className="text-sm font-semibold text-black">
                  Product Details
                </h1>
                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">Category:</span>{" "}
                  {mapIdsToNames(product.categories, categoriesArray || [])}
                </p>

                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">Color:</span>
                  {mapIdsToNames(product.colors, colorsArray || [])}
                </p>
                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">Sizes:</span>{" "}
                  {mapIdsToNames(product.sizes, sizesArray || [])}
                </p>
                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">Material:</span>{" "}
                  {formatFabrics(product.fabrics)}
                </p>
                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">Weight:</span>{" "}
                  {product.weight}KG
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h1 className="text-sm font-semibold text-black">
                  Inventory Information
                </h1>
                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">Stock:</span>{" "}
                  {product.quantity} units
                </p>
                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">Shipping:</span> 2–3 business
                  days
                </p>
                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">SKU:</span>
                  {product?.sku}
                </p>
                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">Margin:</span> 42%
                </p>
                <p className="text-xs text-black flex gap-2">
                  <span className="font-semibold">Return Policy:</span> 30 days
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h1 className="text-sm font-semibold text-black">
                Product Description
              </h1>
              <p className="text-xs text-gray-600 leading-relaxed mt-2">
                {product.description}
              </p>
            </div>
            <hr className="text-gray-200 my-6" />
          </div>
        </div>
        {product?.rejection_reason ||
          (product?.review && (
            <div className="border border-gray-200 ">
              <div className="px-4 py-3 border-b border-gray-200">
                <h1 className="text-black font-semibold text-sm">
                  Admin Rejection Reason
                </h1>
              </div>
              <div className="grid grid-cols-1 gap-4 px-4 py-3">
                <div className="border-b flex justify-between border-gray-200 p-2">
                  <div className="flex gap-2">
                    <CiUser className="text-black text-[25px]" />
                    <div className="w-[350px]">
                      <p className="text-gray-500 text-xs">
                        {product.rejection_reason || product?.review}
                      </p>
                    </div>
                  </div>
                  {/* <p className='text-gray-500 text-xs'>Oct 11, 2023 - 14:32</p> */}
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default ProductComponent;
