"use client";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import { FaWallet } from "react-icons/fa6";
import { TransactionType } from "../../_lib/type";
import { getTransactions } from "@/app/_lib/transactions";
import { toast } from "react-toastify";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import { getWallet } from "@/app/_lib/vendor";

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
  const [accountNumber, setAccountNumber] = useState("");
  const [accountBalance, setAccountBalance] = useState(0.0);
  const [loading, setLoading] = useState(false);

  // Fetch transactions
  useEffect(() => {
    const fetchTransacs = async () => {
      setFetching(true);
      try {
        const res = await getTransactions();
        const trans: TransactionType[] = res?.data?.data?.transactions ?? [];
        setTransactions(trans);
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch transactions");
      } finally {
        setFetching(false);
      }
    };
    fetchTransacs();
  }, []);

  // Fetch wallet info
  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      try {
        const res = await getWallet();
        if (!res.success) {
          toast.error(res.message);
        } else {
          setAccountNumber(res.data.account_number || "");
          setAccountBalance(res.data.available_balance || 0);
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch wallet details");
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  // PAGINATION
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // APPLY FILTERS
  const filteredData = useMemo(() => {
    return (transactions ?? []).filter((item) => {
      const itemDate = new Date(item.created_at);

      if (dateFrom && new Date(dateFrom) > itemDate) return false;
      if (dateTo && new Date(dateTo) < itemDate) return false;
      if (status && item.status.toLowerCase() !== status.toLowerCase()) return false;
      if (minAmount && item.amount < Number(minAmount)) return false;
      if (maxAmount && item.amount > Number(maxAmount)) return false;
      if (
        reference &&
        !item.transaction_reference.toLowerCase().includes(reference.toLowerCase())
      )
        return false;

      return true;
    });
  }, [transactions, dateFrom, dateTo, status, minAmount, maxAmount, reference]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Skeleton Loader Component
  const TableSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-gray-200 animate-pulse text-center">
          {[...Array(6)].map((_, idx) => (
            <td key={idx} className="p-2">
              <div className="h-3 bg-gray-200 rounded"></div>
            </td>
          ))}
          {/* Skeleton for Action column */}
          <td className="p-2">
            <div className="h-3 bg-gray-200 rounded mx-auto w-20"></div>
          </td>
        </tr>
      ))}
    </>
  );

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
            <Link
              href="/payouts"
              className="text-xs text-gray-900 bg-gray-400 rounded-[5px] p-2"
            >
              Withdraw Funds
            </Link>
          </div>
        </div>

        {/* BALANCE CARD */}
        <div className="flex gap-3 my-6 items-center">
          <div className="p-2 bg-gray-200 rounded-[5px]">
            <FaWallet className="text-black text-[25px]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Available Balance</p>
            <h1 className="text-black text-sm font-semibold">₦{accountBalance.toLocaleString()}</h1>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 py-3 px-5 border border-gray-200 rounded-md mb-6">
          <div className="flex flex-col">
            <label className="text-xs">Date From</label>
            <input
              type="date"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Date To</label>
            <input
              type="date"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Status</label>
            <select
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Min Amount</label>
            <input
              type="number"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Max Amount</label>
            <input
              type="number"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Reference ID</label>
            <input
              type="text"
              className="text-sm border border-gray-200 rounded-[5px] p-1"
              placeholder="Search REF..."
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm border border-gray-200 ">
          <thead>
            <tr>
              <th className="p-2 text-xs">Date</th>
              <th className="p-2 text-xs">Reference</th>
              <th className="p-2 text-xs ">Amount</th>
              <th className="p-2 text-xs ">Transaction Fee</th>
              <th className="p-2 text-xs ">Payment Account</th>
              <th className="p-2 text-xs">Status</th>
              <th className="p-2 text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <TableSkeleton />
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row._id} className="border-b text-center border-gray-200">
                  <td className="p-2 text-xs text-gray-500">
                    {new Date(row.created_at).toISOString().split("T")[0]}
                  </td>
                  <td className="p-2 text-xs text-gray-500">{row.transaction_reference}</td>
                  <td className="p-2 text-xs text-gray-500">₦{row.amount.toLocaleString()}</td>
                  <td className="p-2 text-xs text-gray-500">₦0</td>
                  <td className="p-2 text-xs text-gray-500">
                    {row.vendor?.business_name ?? "Unknown Vendor"}
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </td>
                  <td className="p-2 text-xs text-gray-500">
                    <Link
                      href={`/payouts/${row._id}`}
                      className="border border-gray-200 text-gray-500 text-xs px-4 py-2 rounded my-2 inline-block"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-3 text-gray-500">
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
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default Page;
