"use client";
import React, { useEffect, useState } from "react";
import { MdInventory2, MdPendingActions } from "react-icons/md";
import { FaCartArrowDown, FaMoneyBillWave } from "react-icons/fa";
import { fetchAnalytics } from "../_lib/vendor";

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

function DashboardGrid({ products }: ProductsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchAnalytics();
        console.log(res);
        setAnalytics(res.data);
      } catch (err) {
        console.log("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-100 animate-pulse py-4 px-4 border border-gray-200 rounded-md"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="h-3 w-20 bg-gray-300 rounded"></div>
              <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-5 w-16 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-10 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <p className="text-gray-500 text-sm mt-4">
        Could not load analytics. Try again later.
      </p>
    );
  }

  const array = [
    {
      text: "Total Products",
      keyword: analytics.products,
      icon: <MdInventory2 color="black" size={22} />,
    },
    {
      text: "Total Orders",
      keyword: analytics.orders,
      icon: <FaCartArrowDown color="black" size={22} />,
    },
    {
      text: "Total Revenue",
      keyword: "₦1",
      percentage: "18%",
      icon: <FaMoneyBillWave color="black" size={22} />,
    },
    {
      text: "Pending Products",
      keyword: analytics?.totalPending || 0,
      percentage: "5%",
      icon: <MdPendingActions color="black" size={22} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
      {array.map((item, index) => (
        <div key={index} className="bg-white py-2 px-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-xs">{item.text}</p>
            {item.icon}
          </div>

          <h3 className="text-lg font-semibold text-black">{item.keyword}</h3>

          {item.percentage && (
            <p className="text-green-500 font-semibold text-xs">
              {item.percentage}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default DashboardGrid;
