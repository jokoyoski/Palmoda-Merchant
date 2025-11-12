"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

function SalesPerformance() {
  // Example sales data
  const data = [
    { day: "Mon", thisWeek: 400, lastWeek: 300 },
    { day: "Tue", thisWeek: 600, lastWeek: 400 },
    { day: "Wed", thisWeek: 800, lastWeek: 500 },
    { day: "Thu", thisWeek: 700, lastWeek: 600 },
    { day: "Fri", thisWeek: 900, lastWeek: 700 },
    { day: "Sat", thisWeek: 850, lastWeek: 650 },
    { day: "Sun", thisWeek: 950, lastWeek: 720 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 w-full md:w-[300px]">
      <h2 className="text-black font-semibold text-base mb-3">
        Sales Performance
      </h2>

      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="thisWeek"
              stroke="#000000"
              strokeWidth={2}
              dot={false}
              name="This Week"
            />
            <Line
              type="monotone"
              dataKey="lastWeek"
              stroke="#9ca3af"
              strokeWidth={2}
              dot={false}
              name="Last Week"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-xs text-gray-600 mt-2">
        <p>
          <span className="font-semibold text-black">This Week:</span> ₦2,854
        </p>
        <p>
          <span className="font-semibold text-black">Last Week:</span> ₦2,356
        </p>
      </div>
    </div>
  );
}

export default SalesPerformance;
