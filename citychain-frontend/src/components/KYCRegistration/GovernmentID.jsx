import React, { useState } from "react";
import {
  IdentificationIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const GovernmentID = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const [verificationStatus, setVerificationStatus] = useState({});

  const validateStep = () => {
    const newErrors = {};

    if (!formData.aadhaar_number?.trim())
      newErrors.aadhaar_number = "Aadhaar number is required";
    if (!formData.pan_number?.trim())
      newErrors.pan_number = "PAN number is required";

    // Aadhaar validation (12 digits)
    if (formData.aadhaar_number && !/^\d{12}$/.test(formData.aadhaar_number)) {
      newErrors.aadhaar_number = "Aadhaar number must be 12 digits";
    }

    // PAN validation (format: ABCDE1234F)
    if (
      formData.pan_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number)
    ) {
      newErrors.pan_number = "Invalid PAN format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const verifyDocuments = async () => {
    if (!validateStep()) return;

    // Simulate verification process
    setVerificationStatus({ verifying: true });

    // This would call the backend verification logic from user.controller.js
    setTimeout(() => {
      setVerificationStatus({
        aadhaar: "verified",
        pan: "verified",
        verifying: false,
      });
    }, 2000);
  };

  const handleNext = () => {
    if (
      verificationStatus.aadhaar === "verified" &&
      verificationStatus.pan === "verified"
    ) {
      nextStep();
    } else {
      verifyDocuments();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <IdentificationIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          Government ID Verification
        </h2>
        <p className="text-gray-600">Step 2 of 4</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aadhaar Number *
          </label>
          <input
            type="text"
            value={formData.aadhaar_number || ""}
            onChange={(e) =>
              setFormData({ ...formData, aadhaar_number: e.target.value })
            }
            className={`w-full p-3 border rounded-lg ${errors.aadhaar_number ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter 12-digit Aadhaar number"
            maxLength="12"
          />
          {errors.aadhaar_number && (
            <p className="text-red-500 text-sm mt-1">{errors.aadhaar_number}</p>
          )}
          {verificationStatus.aadhaar === "verified" && (
            <p className="text-green-600 text-sm mt-1 flex items-center">
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              Aadhaar verified successfully
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PAN Number *
          </label>
          <input
            type="text"
            value={formData.pan_number || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                pan_number: e.target.value.toUpperCase(),
              })
            }
            className={`w-full p-3 border rounded-lg ${errors.pan_number ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter PAN number (e.g., ABCDE1234F)"
            maxLength="10"
          />
          {errors.pan_number && (
            <p className="text-red-500 text-sm mt-1">{errors.pan_number}</p>
          )}
          {verificationStatus.pan === "verified" && (
            <p className="text-green-600 text-sm mt-1 flex items-center">
              <ShieldCheckIcon className="h-4 w-4 mr-1" />
              PAN verified successfully
            </p>
          )}
        </div>

        {verificationStatus.verifying && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Verifying documents...</p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={prevStep}
            className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={verificationStatus.verifying}
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {verificationStatus.aadhaar === "verified" &&
            verificationStatus.pan === "verified"
              ? "Next Step"
              : "Verify Documents"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentID;
