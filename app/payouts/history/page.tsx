"use client";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import { FaWallet } from "react-icons/fa6";
import {TransactionType} from "../../_lib/type"
import { getTransactions } from "@/app/_lib/transactions";
import { toast } from "react-toastify";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

const payoutsData = [
  {
    id: 1,
    reference: "REF-2029A",
    amount: 1250,
    status: "Successful",
    date: "2025-01-04",
  },
  {
    id: 2,
    reference: "REF-2030B",
    amount: 800,
    status: "Pending",
    date: "2025-01-06",
  },
  {
    id: 3,
    reference: "REF-2031C",
    amount: 1500,
    status: "Failed",
    date: "2025-01-10",
  },
  {
    id: 4,
    reference: "REF-2032D",
    amount: 2400,
    status: "Successful",
    date: "2025-01-12",
  },
  {
    id: 5,
    reference: "REF-2033E",
    amount: 300,
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 6,
    reference: "REF-2034F",
    amount: 950,
    status: "Successful",
    date: "2025-01-18",
  },
  {
    id: 7,
    reference: "REF-2035G",
    amount: 2100,
    status: "Failed",
    date: "2025-01-20",
  },
  {
    id: 8,
    reference: "REF-2036H",
    amount: 720,
    status: "Pending",
    date: "2025-01-22",
  },
  {
    id: 9,
    reference: "REF-2037I",
    amount: 1800,
    status: "Successful",
    date: "2025-01-25",
  },
  {
    id: 10,
    reference: "REF-2038J",
    amount: 400,
    status: "Failed",
    date: "2025-01-28",
  },
];

function Page() {
  // FILTER STATES
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [reference, setReference] = useState("");
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
     const fetchTransacs = async () => {
       try {
        setFetching(true)
         const res = await getTransactions();
         console.log(res.data.data.transactions);
         setTransactions(res.data.data.transactions);
         setFetching(false);
       } catch (error: any) {
          toast.error(error?.message)
       }finally{
        setFetching(false);
       }
     }
     fetchTransacs();
  }, [])

  // PAGINATION
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // APPLY FILTERS
  const filteredData = useMemo(() => {
  return transactions.filter((item) => {
    const itemDate = new Date(item.created_at);

    // Date filter
    if (dateFrom && new Date(dateFrom) > itemDate) return false;
    if (dateTo && new Date(dateTo) < itemDate) return false;

    // Status filter
    if (status && item.status.toLowerCase() !== status.toLowerCase()) return false;

    // Amount filter
    if (minAmount && item.amount < Number(minAmount)) return false;
    if (maxAmount && item.amount > Number(maxAmount)) return false;

    // Reference filter
    if (
      reference &&
      !item.transaction_reference.toLowerCase().includes(reference.toLowerCase())
    )
      return false;

    return true;
  });
}, [transactions, dateFrom, dateTo, status, minAmount, maxAmount, reference]);


  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if(fetching){
   return (
  <>
    {[1, 2, 3, 4, 5].map((i) => (
      <tr key={i} className="border-b border-gray-200 animate-pulse text-center">
        <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
        <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
        <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
        <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
        <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
        <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
      </tr>
    ))}
  </>
   )

  }

  return (
    <ProtectedRoute>
      <section className="bg-white min-h-screen px-4 md:px-8 py-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-black font-semibold text-lg">Payouts History</h1>
          <p className="text-xs text-gray-500">
            View all your withdrawals, settlement timelines, and payout statuses.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/payouts" className="text-xs text-gray-900 bg-gray-400 rounded-[5px] p-2">
            Withdraw Funds
          </Link>
          <p className="text-xs text-gray-900 bg-gray-200 rounded-[5px] p-2">
            Export CSV
          </p>
        </div>
      </div>

      {/* BALANCE CARD */}
      <div className="flex gap-3 my-6 items-center">
        <div className="p-2 bg-gray-200 rounded-[5px]">
          <FaWallet className="text-black text-[25px]" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Available Balance</p>
          <h1 className="text-black text-sm font-semibold">$6,842.00</h1>
          <p className="text-xs text-gray-500">Next settlement: Today</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 py-3 px-5 border border-gray-200  rounded-md mb-6">
        <div className="flex flex-col">
          <label className="text-xs">Date From</label>
          <input type="date" className="text-sm border border-gray-200 rounded-[5px] p-1"
            value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs">Date To</label>
          <input type="date" className="text-sm border border-gray-200 rounded-[5px] p-1"
            value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs">Status</label>
          <select className="text-sm border border-gray-200 rounded-[5px] p-1"
            value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="Successful">Successful</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs">Min Amount</label>
          <input type="number" className="text-sm border border-gray-200 rounded-[5px] p-1"
            value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs">Max Amount</label>
          <input type="number" className="text-sm border border-gray-200 rounded-[5px] p-1"
            value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
        </div>

        <div className="flex flex-col">
          <label className="text-xs">Reference ID</label>
          <input type="text" className="text-sm border border-gray-200 rounded-[5px] p-1"
            placeholder="Search REF..."
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm border border-gray-200 ">
        <thead className="">
          <tr>
            <th className="p-2 text-xs">Date</th>
            <th className="p-2 text-xs">Reference</th>
            <th className="p-2 text-xs ">Amount</th>
            <th className="p-2 text-xs ">Transaction Fee</th>
            <th className="p-2 text-xs ">Payment Accout</th>
            <th className="p-2 text-xs">Status</th>
            <th className="p-2 text-xs">Date</th>
          </tr>
        </thead>

        <tbody>
  {/* Skeleton Loader */}
  {fetching && (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-gray-200 animate-pulse text-center">
          <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
          <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
          <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
          <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
          <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
          <td className="p-2"><div className="h-3 bg-gray-200 rounded"></div></td>
        </tr>
      ))}
    </>
  )}

  {/* Real table rows */}
  {!fetching &&
   paginatedData.map((row) => (
  <tr key={row._id} className="border-b text-center border-gray-200">
    <td className="p-2 text-xs text-gray-500">
      {new Date(row.created_at).toISOString().split("T")[0]}
    </td>

    <td className="p-2 text-xs text-gray-500">
      {row.transaction_reference}
    </td>

    <td className="p-2 text-xs text-gray-500">
      ${row.amount.toLocaleString()}
    </td>

    <td className="p-2 text-xs text-gray-500">$6</td>

    <td className="p-2 text-xs text-gray-500">
      {row.vendor?.business_name ?? "Unknown Vendor"}
    </td>

    <td className="p-2 text-xs text-gray-500">
      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
    </td>
  </tr>
))
}

  {!fetching && paginatedData.length === 0 && (
    <tr>
      <td colSpan={4} className="text-center p-3 text-gray-500">
        No records found.
      </td>
    </tr>
  )}
</tbody>

      </table>

      {/* PAGINATION */}
      <div className="flex justify-end gap-4 items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="p-2 text-sm border rounded disabled:opacity-50"
          disabled={page === 1}
        >
          Previous
        </button>

        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="p-2 text-sm border rounded disabled:opacity-50"
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </section>
    </ProtectedRoute>
  );
}

export default Page;
