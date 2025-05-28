import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import KYCCheckModal from "../components/KYCCheckModel";

const Register = () => {
  const navigate = useNavigate();
  const [showKycModal, setShowKycModal] = useState(true);
  const [formData, setFormData] = useState({
    oneKYC_user_passport: "",
    account_type: "savings",
    initial_deposit: "",
    monthly_income: "",
    employment_type: "",
    employer_name: "",
    current_address: "",
    branch_code: "",
    terms_accepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Static data
  const employmentTypes = [
    "salaried",
    "self_employed",
    "business_owner",
    "freelancer",
    "retired",
    "student",
    "unemployed",
  ];

  const branchCodes = [
    { code: "001234", name: "Mumbai Central Branch" },
    { code: "001235", name: "Delhi Main Branch" },
    { code: "001236", name: "Bangalore Tech Branch" },
    { code: "001237", name: "Chennai Express Branch" },
    { code: "001238", name: "Kolkata Heritage Branch" },
  ];

  const handleKycVerified = (kycPassport) => {
    setFormData((prev) => ({
      ...prev,
      oneKYC_user_passport: kycPassport,
    }));
    setShowKycModal(false);
  };

  const handleKycModalClose = () => {
    navigate("/"); // Go back to homepage instead of dashboard
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oneKYC_user_passport.trim()) {
      newErrors.oneKYC_user_passport = "KYC Passport Number is required";
    }

    if (!formData.initial_deposit) {
      newErrors.initial_deposit = "Initial deposit is required";
    } else if (parseFloat(formData.initial_deposit) < 1000) {
      newErrors.initial_deposit = "Minimum initial deposit is ₹1000";
    }

    if (!formData.monthly_income) {
      newErrors.monthly_income = "Monthly income is required";
    } else if (parseFloat(formData.monthly_income) <= 0) {
      newErrors.monthly_income = "Monthly income must be greater than 0";
    }

    if (!formData.employment_type) {
      newErrors.employment_type = "Employment type is required";
    }

    if (!formData.current_address.trim()) {
      newErrors.current_address = "Current address is required";
    }

    if (!formData.branch_code) {
      newErrors.branch_code = "Branch selection is required";
    }

    if (!formData.terms_accepted) {
      newErrors.terms_accepted = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/bankuser/register/${formData.oneKYC_user_passport}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Remove Authorization header since user is not authenticated yet
          },
          body: JSON.stringify({
            account_type: formData.account_type,
            initial_deposit: parseFloat(formData.initial_deposit),
            monthly_income: parseFloat(formData.monthly_income),
            employment_type: formData.employment_type,
            employer_name: formData.employer_name,
            current_address: formData.current_address,
            branch_code: formData.branch_code,
            terms_accepted: formData.terms_accepted,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Bank account created successfully:", data);
        // Redirect to login page after successful registration
        navigate("/login", {
          state: {
            message:
              "Bank account created successfully! Please login to continue.",
          },
        });
      } else {
        setErrors({ submit: data.message || "Failed to create bank account" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* KYC Check Modal */}
      <KYCCheckModal
        isOpen={showKycModal}
        onClose={handleKycModalClose}
        onKycVerified={handleKycVerified}
      />

      {/* Bank Account Registration Form */}
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <BanknotesIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Open Your Bank Account
            </h2>
            <p className="mt-2 text-gray-600">
              Sign up with CitiChain and open your digital bank account today.
            </p>

            {/* KYC Status Indicator */}
            {formData.oneKYC_user_passport && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-700 font-medium">
                  KYC Verified ✓
                </span>
              </div>
            )}
          </div>

          {/* Form Container */}
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* KYC Passport Number - Auto-filled and readonly */}
              <div>
                <label
                  htmlFor="oneKYC_user_passport"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  KYC Passport Number
                </label>
                <input
                  id="oneKYC_user_passport"
                  name="oneKYC_user_passport"
                  type="text"
                  required
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  placeholder="Auto-filled from KYC verification"
                  value={formData.oneKYC_user_passport}
                />
                <p className="mt-1 text-xs text-green-600">
                  ✓ Verified through KYC process
                </p>
              </div>

              {/* Account Type */}
              <div>
                <label
                  htmlFor="account_type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                  Account Type
                </label>
                <select
                  id="account_type"
                  name="account_type"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.account_type}
                  onChange={handleChange}
                >
                  <option value="savings">Savings Account</option>
                  <option value="current">Current Account</option>
                </select>
              </div>

              {/* Initial Deposit & Monthly Income */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="initial_deposit"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Initial Deposit (₹)
                  </label>
                  <input
                    id="initial_deposit"
                    name="initial_deposit"
                    type="number"
                    min="1000"
                    required
                    className={`w-full px-4 py-3 border ${
                      errors.initial_deposit
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Minimum ₹1000"
                    value={formData.initial_deposit}
                    onChange={handleChange}
                  />
                  {errors.initial_deposit && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.initial_deposit}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum deposit required: ₹1,000
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="monthly_income"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Monthly Income (₹)
                  </label>
                  <input
                    id="monthly_income"
                    name="monthly_income"
                    type="number"
                    min="0"
                    required
                    className={`w-full px-4 py-3 border ${
                      errors.monthly_income
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter monthly income"
                    value={formData.monthly_income}
                    onChange={handleChange}
                  />
                  {errors.monthly_income && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.monthly_income}
                    </p>
                  )}
                </div>
              </div>

              {/* Employment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="employment_type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Employment Type
                  </label>
                  <select
                    id="employment_type"
                    name="employment_type"
                    required
                    className={`w-full px-4 py-3 border ${
                      errors.employment_type
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={formData.employment_type}
                    onChange={handleChange}
                  >
                    <option value="">Select employment type</option>
                    {employmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  {errors.employment_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.employment_type}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="employer_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Employer Name (Optional)
                  </label>
                  <input
                    id="employer_name"
                    name="employer_name"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter employer name"
                    value={formData.employer_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Current Address */}
              <div>
                <label
                  htmlFor="current_address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                  Current Address
                </label>
                <textarea
                  id="current_address"
                  name="current_address"
                  rows="3"
                  required
                  className={`w-full px-4 py-3 border ${
                    errors.current_address
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your complete current address"
                  value={formData.current_address}
                  onChange={handleChange}
                />
                {errors.current_address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.current_address}
                  </p>
                )}
              </div>

              {/* Branch Selection */}
              <div>
                <label
                  htmlFor="branch_code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                  Select Branch
                </label>
                <select
                  id="branch_code"
                  name="branch_code"
                  required
                  className={`w-full px-4 py-3 border ${
                    errors.branch_code ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  value={formData.branch_code}
                  onChange={handleChange}
                >
                  <option value="">Select your preferred branch</option>
                  {branchCodes.map((branch) => (
                    <option key={branch.code} value={branch.code}>
                      {branch.name} - {branch.code}
                    </option>
                  ))}
                </select>
                {errors.branch_code && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.branch_code}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="terms_accepted"
                  name="terms_accepted"
                  type="checkbox"
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 ${
                    errors.terms_accepted ? "border-red-300" : ""
                  }`}
                  checked={formData.terms_accepted}
                  onChange={handleChange}
                />
                <label
                  htmlFor="terms_accepted"
                  className="ml-3 block text-sm text-gray-900"
                >
                  I accept the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 underline"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  for opening a bank account with CitiChain.
                </label>
              </div>
              {errors.terms_accepted && (
                <p className="text-sm text-red-600">{errors.terms_accepted}</p>
              )}

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Opening Account...
                    </div>
                  ) : (
                    "Open Bank Account"
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  What happens next?
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Your bank account will be created instantly</li>
                  <li>• You'll receive account details on your dashboard</li>
                  <li>• Initial deposit will be processed within 24 hours</li>
                  <li>
                    • You can start using digital banking services immediately
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
