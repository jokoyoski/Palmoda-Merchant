"use client";
import React, { useState } from "react";
import { FaTshirt } from "react-icons/fa";

interface ProductType {
  _id: string;
  name: string;
  discounted_price: number;
  status: string;
  quantity: number;
 images: string[];
}

interface ProductsProps {
  products: ProductType[];
}

function Products({ products }: ProductsProps) {
  const [filter, setFilter] = useState<string>("All");

  // FIX: Map backend status to UI status style
  const formatStatus = (status: string): string => {
    if (status === "Approved") return "APPROVED";
    if (status === "Pending Review") return "PENDING";
    if (status === "Rejected") return "REJECTED";
    return status?.toUpperCase() || "UNKNOWN";
  };

  // Filter items
  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((p) => formatStatus(p.status) === filter);

  const statuses = ["All", "LIVE", "PENDING", "APPROVED", "REJECTED"];

  return (
    <div className="w-full lg:w-[70%] px-4 py-2 bg-white rounded-md shadow-sm border border-gray-200">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-black text-lg">Product Status</h2>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm px-3 py-1 rounded-md border ${
                filter === s
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Inventory</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">

                <td className="p-3 flex items-center gap-2">
                  <img src={product.images?.[0]} className="w-[40px]" alt={product.name} />
                  <span className="text-black">{product.name}</span>
                </td>

                <td className="p-3">
                  ₦{product.discounted_price?.toLocaleString()}
                </td>

                <td
                  className={`p-3 font-semibold ${
                    formatStatus(product.status) === "LIVE"
                      ? "text-green-600"
                      : formatStatus(product.status) === "PENDING"
                      ? "text-yellow-600"
                      : formatStatus(product.status) === "APPROVED"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {formatStatus(product.status)}
                </td>

                <td className="p-3 text-gray-700">
                  {product.quantity} units
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 mt-3">
        Showing {filteredProducts.length} of {products.length} products
      </p>
    </div>
  );
}

export default Products;
