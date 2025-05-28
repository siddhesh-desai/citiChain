import React, { useState } from "react";
import { Link } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

const KYCCheckModal = ({ isOpen, onClose, onKycVerified }) => {
  const [kycPassport, setKycPassport] = useState("");
  const [kycError, setKycError] = useState("");
  const [kycLoading, setKycLoading] = useState(false);

  const handleKycCheck = async () => {
    if (!kycPassport.trim()) {
      setKycError("Please enter your oneKYC passport number");
      return;
    }

    setKycLoading(true);
    setKycError("");

    try {
      // Check if oneKYC passport exists and is approved (without authentication)
      const response = await fetch(
        `http://localhost:8000/api/v1/users/check-kyc/${kycPassport}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Remove Authorization header since user is not authenticated
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.data?.kyc_status === "approved") {
        // KYC is approved, allow bank account opening
        onKycVerified(kycPassport);
      } else if (data.data?.kyc_status === "pending") {
        setKycError(
          "Your KYC is still pending approval. Please wait for verification."
        );
      } else if (data.data?.kyc_status === "rejected") {
        setKycError(
          "Your KYC was rejected. Please contact support or resubmit KYC."
        );
      } else {
        setKycError("Invalid oneKYC passport number or KYC not found.");
      }
    } catch (error) {
      console.error("KYC check error:", error);
      setKycError("Error checking KYC status. Please try again.");
    } finally {
      setKycLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Verify oneKYC Passport
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              To open a bank account, please enter your oneKYC passport number
              to verify your identity.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              oneKYC Passport Number
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your oneKYC passport number"
              value={kycPassport}
              onChange={(e) => setKycPassport(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleKycCheck()}
            />

            {kycError && (
              <p className="mt-2 text-sm text-red-600">{kycError}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleKycCheck}
              disabled={kycLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {kycLoading ? "Verifying..." : "Verify KYC"}
            </button>

            <Link
              to="/kyc"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
            >
              Don't have KYC?
            </Link>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCCheckModal;
