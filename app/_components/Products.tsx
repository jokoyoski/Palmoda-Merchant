"use client";
import React, { useState } from "react";
import { FaTshirt, FaShoePrints, FaShoppingBag, FaGem } from "react-icons/fa";

function Products() {
  // Product data
  const products = [
    {
      id: 1,
      name: "Silk Evening Gown",
      price: 329.99,
      status: "LIVE",
      inventory: 24,
      icon: <FaGem className="text-pink-500 text-2xl" />,
    },
    {
      id: 2,
      name: "Tailored Wool Blazer",
      price: 249.99,
      status: "PENDING",
      inventory: 18,
      icon: <FaShoppingBag className="text-blue-500 text-2xl" />,
    },
    {
      id: 3,
      name: "Cotton Logo T-shirt",
      price: 59.99,
      status: "APPROVED",
      inventory: 45,
      icon: <FaTshirt className="text-green-500 text-2xl" />,
    },
    {
      id: 4,
      name: "Leather Chain Handbag",
      price: 189.99,
      status: "REJECTED",
      inventory: 12,
      icon: <FaShoePrints className="text-red-500 text-2xl" />,
    },
  ];

  const [filter, setFilter] = useState<string>("All");

  // Filtered products
  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((p) => p.status === filter);

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
        <table className="min-w-full   text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3 ">Product</th>
              <th className="p-3 ">Price</th>
              <th className="p-3 ">Status</th>
              <th className="p-3 ">Inventory</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 flex items-center gap-2 ">
                  {product.icon}
                  <span className="text-black">{product.name}</span>
                </td>
                <td className="p-3 ">${product.price.toFixed(2)}</td>
                <td
                  className={`p-3  font-semibold ${
                    product.status === "LIVE"
                      ? "text-green-600"
                      : product.status === "PENDING"
                      ? "text-yellow-600"
                      : product.status === "APPROVED"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {product.status}
                </td>
                <td className="p-3  text-gray-700">
                  {product.inventory} units
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
