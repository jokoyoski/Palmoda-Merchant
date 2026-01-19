"use client";
import { useAuth } from "../_lib/AuthContext";
import ProtectedRoute from "../_components/ProtectedRoute";
import { CiUser, CiMail, CiPhone, CiShop } from "react-icons/ci";
import { FiCheck, FiX } from "react-icons/fi";

function ProfilePage() {
  const { user } = useAuth();

  const verificationItems = [
    {
      label: "Business Verification",
      verified: user?.is_business_verified,
    },
    {
      label: "Identity Verification",
      verified: user?.is_identity_verified,
    },
    {
      label: "Bank Information Verification",
      verified: user?.is_bank_information_verified,
    },
    {
      label: "Wallet Activated",
      verified: user?.is_wallet_activated,
    },
  ];

  return (
    <ProtectedRoute>
      <section className="bg-gray-100 min-h-screen px-4 md:px-8 py-6 w-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-black font-semibold text-2xl mb-6">Profile</h1>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <CiUser size={40} className="text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">
                  {user?.business_name}
                </h2>
                <p className="text-gray-500 text-sm">Vendor Account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CiUser size={24} className="text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Contact Person</p>
                  <p className="text-sm font-medium text-black">
                    {user?.contact_person_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CiMail size={24} className="text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-black">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CiPhone size={24} className="text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm font-medium text-black">
                    {user?.phone_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CiShop size={24} className="text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Business Name</p>
                  <p className="text-sm font-medium text-black">
                    {user?.business_name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-4">
              Verification Status
            </h3>
            <div className="space-y-3">
              {verificationItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.verified ? (
                      <>
                        <FiCheck className="text-green-600" size={18} />
                        <span className="text-sm font-medium text-green-600">
                          Verified
                        </span>
                      </>
                    ) : (
                      <>
                        <FiX className="text-red-600" size={18} />
                        <span className="text-sm font-medium text-red-600">
                          Not Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default ProfilePage;
