"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../_components/ProtectedRoute";
import { toast } from "react-toastify";
import { getKycDetails, activateWallet, getWallet } from "../_lib/vendor";
import { useAuth } from "../_lib/AuthContext";
import { getTransactions, requestPayout } from "../_lib/transactions";
import { TransactionType } from "../_lib/type";

function page() {
  const { user } = useAuth();
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [amountError, setAmountError] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountBalance, setAccountBalance] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [showBvnModal, setShowBvnModal] = useState(false);
  const [bvn, setBvn] = useState("");
  const [activating, setActivating] = useState(false);
  const [amount, setAmount] = useState(0);
  const [fee] = useState(0); // fixed fee for now
  const [narration, setNarration] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      try {
        const res = await getWallet();
        console.log(res);
        if (res.success === false) {
          toast.error(res.message);
        } else {
          // Populate form fields
          setBankName(res.data.bank_name || "");
          setAccountHolder(res.data.account_holder_name || "");
          setAccountNumber(res.data.account_number || "");
          setAccountBalance(res.data.available_balance);
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to fetch KYC details");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

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

  const handleActivate = async () => {
    if (bvn.length !== 11) {
      toast.error("BVN must be 11 digits.");
      return;
    }

    try {
      setActivating(true);

      const res = await activateWallet(bvn);

      if (!res.success) {
        toast.error(res.message || "Failed to activate wallet");
        return;
      }

      // Refresh KYC details so UI updates
      const refreshed = await getWallet();
      if (refreshed.success) {
        setBankName(refreshed.data.bank_name || "");
        setAccountHolder(refreshed.data.account_holder_name || "");
        setAccountNumber(refreshed.data.account_number || "");
      }
      toast.success("Wallet activated successfully");
      setShowBvnModal(false); // Close modal on success
    } catch (error: any) {
      toast.error(error.message || "Failed to activate wallet");
    } finally {
      setActivating(false);
    }
  };

  const last4Digits = accountNumber.slice(-4);

  const handlePayout = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (Number(amount) > accountBalance) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }

    if (!user?.is_wallet_activated) {
      toast.error("Activate your wallet before requesting payout");
      return;
    }

    setRequesting(true);

    try {
      const res = await requestPayout(Number(amount), narration);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message || "Payout requested successfully!");

      // Clear form
      setAmount(0);
      setNarration("");

      // Refresh balance
      const wallet = await getWallet();
      if (wallet?.success) {
        setAccountBalance(wallet.data.available_balance);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-black font-semibold text-lg">Withdraw Funds</h1>
            <p className="text-xs text-gray-500">
              Transfer your available balance to your registered bank account.
            </p>
          </div>
          <div className="bg-white px-3 py-1 rounded-[6px]">
            <p className="text-xs text-gray-500">Available Balance</p>
            <h1 className="text-black font-semibold text-lg">
              {" "}
              ₦{accountBalance.toLocaleString()}
            </h1>
            <p className="text-xs text-gray-500">
              Next settlement: Today Minimum withdrawal: ₦5000
            </p>

            {user?.is_wallet_activated ? (
              <h3 className="text-xs text-black my-3">Wallet activated</h3>
            ) : (
              <button
                onClick={() => setShowBvnModal(true)}
                className="bg-purple-600 text-white text-xs px-3 py-1 mb-2 rounded-md mt-2"
              >
                Add BVN
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-3 items-start mt-6">
          {/* Left Column - Withdrawal Forms */}
          <div className="flex-1 w-full">
            <div className="bg-white px-4 my-2 rounded-[6px] py-2">
              <h1 className="text-black font-semibold">Payout Account</h1>
              {loading ? (
                // Skeleton loader
                <div className="animate-pulse bg-gray-200 rounded-md h-20 mt-3"></div>
              ) : (
                <div className="bg-gray-200 px-3 flex justify-between py-1 rounded-[6px] mt-3">
                  <div>
                    <h1 className="text-gray-900 text-sm">{bankName}</h1>
                    <p className="text-gray-700 text-xs">{accountHolder}</p>
                    <p className="text-gray-500 text-xs">
                      Account ending in •••• {last4Digits}
                    </p>
                  </div>
                  <p className="text-purple-500 text-xs">Primary · Locked</p>
                </div>
              )}
              <p className="text-gray-500 my-2 text-xs">
                Payout account can only be updated by Palmoda admin. Contact
                support to make changes.
              </p>
            </div>

            <div className="bg-white px-4 my-4 rounded-[6px] py-2">
              <h1 className="text-black font-semibold">Withdrawal Details</h1>
              <div className="flex gap-1 my-2 flex-col">
                <label className="text-gray-500 text-xs" htmlFor="">
                  Amount to withdraw
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    let val = e.target.value;

                    if (val === "") {
                      setAmount(0);
                      setAmountError("");
                      return;
                    }

                    let num = Number(val);

                    if (num < 0) {
                      setAmountError("Amount cannot be negative.");
                      return;
                    }

                    if (num > accountBalance) {
                      setAmountError(
                        "You cannot withdraw more than your account balance."
                      );
                      return;
                    }

                    setAmountError("");
                    setAmount(num);
                  }}
                  className="text-gray-500 border border-gray-600 p-2 rounded-[5px] text-xs"
                />

                {amountError && (
                  <p className="text-red-500 text-[11px] mt-1">{amountError}</p>
                )}
              </div>

              <div className="flex gap-3 my-2.5">
                <button
                  onClick={() => setAmount(accountBalance)}
                  className="text-gray-900 p-2 rounded-[5px] bg-gray-200 text-xs"
                >
                  Withdraw Full Balance
                </button>

                <button
                  onClick={() => setAmount(accountBalance * 0.5)}
                  className="text-gray-900 p-2 rounded-[5px] bg-gray-200 text-xs"
                >
                  Withdraw 50% of Balance
                </button>

                <button
                  onClick={() => setAmount(0)}
                  className="text-gray-900 p-2 rounded-[5px] bg-gray-200 text-xs"
                >
                  Custom
                </button>
              </div>

              <div className="bg-gray-200 px-2 py-1 mb-3 rounded-[5px]">
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-xs">Available balance:</p>
                  <h1 className=" text-black text-sm font-semibold">
                    ₦{accountBalance.toLocaleString()}
                  </h1>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-xs">Transaction fee:</p>
                  <h1 className=" text-black text-sm font-semibold">₦{fee}</h1>
                </div>

                <hr className="my-2 text-gray-500" />

                <div className="flex justify-between items-center">
                  <p className="text-black text-xs">You will receive:</p>
                  <h1 className=" text-black text-sm font-semibold">
                    ₦{Math.max(amount - fee, 0).toLocaleString()}
                  </h1>
                </div>
              </div>
            </div>

            <div className="bg-white mb-4 px-4 my-4 rounded-[6px] py-2">
              <h1 className="text-black font-semibold">Notes (optional)</h1>
              <textarea
                name=""
                id=""
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                className="px-4 py-2 text-gray-500 border w-full my-4 border-gray-200"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button className="bg-inherit text-black text-xs">Cancel</button>
              <button
                disabled={
                  requesting ||
                  !amount ||
                  Number(amount) <= 0 ||
                  Number(amount) > accountBalance ||
                  !user?.is_wallet_activated
                }
                onClick={handlePayout}
                className="bg-gray-300 text-gray-900 p-2 text-xs rounded-[5px]"
              >
                {requesting ? "Requesting" : "Confirm Withdrawal"}
              </button>
            </div>
          </div>

          {/* Right Column - Recent Payouts */}
          <div className="w-[30%] bg-white px-4 my-2 rounded-[6px] py-2 h-fit hidden md:block">
            <h1 className="text-black font-semibold">Recent Payouts</h1>

            {fetching ? (
              // Skeleton loader while fetching
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="my-2 border-b border-gray-200 px-3 flex justify-between py-1 animate-pulse"
                  >
                    <div>
                      <h1 className="text-black text-sm font-semibold bg-gray-200 h-4 w-20 mb-1"></h1>
                      <p className="text-gray-500 text-xs bg-gray-200 h-3 w-16 mb-1"></p>
                      <p className="text-gray-500 text-xs bg-gray-200 h-3 w-20"></p>
                    </div>
                    <p className="text-green-500 text-xs bg-gray-200 h-3 w-10"></p>
                  </div>
                ))}
              </>
            ) : (
              <>
                {transactions.slice(0, 3).map((txn) => (
                  <div
                    key={txn._id}
                    className="my-2 border-b border-gray-200 px-3 flex justify-between py-1"
                  >
                    <div>
                      <h1 className="text-black text-sm font-semibold">
                        ₦{txn.amount.toLocaleString()}
                      </h1>
                      <p className="text-gray-500 text-xs">
                        {new Date(txn.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Ref: {txn.transaction_reference}
                      </p>
                    </div>
                    <p
                      className={`text-xs ${
                        txn.status.toLowerCase() === "successful"
                          ? "text-green-500"
                          : txn.status.toLowerCase() === "pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </p>
                  </div>
                ))}
              </>
            )}

            <Link
              href="/payouts/history"
              className="text-blue-400 text-xs underline my-2 block"
            >
              View History
            </Link>
          </div>
        </div>

        {/* Modal */}
        {showBvnModal && (
          <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-md p-6 w-[90%] max-w-sm shadow-lg">
              <h1 className="text-black font-semibold text-lg mb-2 text-center">
                Activate Wallet
              </h1>
              <p className="text-gray-500 text-xs text-center mb-4">
                Enter your BVN to activate your withdrawal wallet.
              </p>

              <input
                type="number"
                maxLength={11}
                value={bvn}
                onChange={(e) => {
                  if (e.target.value.length <= 11) setBvn(e.target.value);
                }}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm outline-none"
                placeholder="Enter 11-digit BVN"
              />

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowBvnModal(false)}
                  className="text-gray-600 text-xs"
                >
                  Cancel
                </button>

                <button
                  onClick={handleActivate}
                  className="bg-black text-white text-xs px-4 py-2 rounded-md"
                >
                  {activating ? "Activating..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </ProtectedRoute>
  );
}

export default page;
