import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  BanknotesIcon,
  UserIcon,
  CreditCardIcon,
  PhoneIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

const TransferMoneyPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [transferData, setTransferData] = useState({
    recipientType: "upi", // 'upi', 'account', 'phone'
    recipient: "",
    amount: "",
    note: "",
    pin: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateUPI = (upi) => /^[\w.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi);
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const validateAccount = (account) => /^\d{9,18}$/.test(account);

  const handleInputChange = (field, value) => {
    setTransferData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate recipient
      if (!transferData.recipient) {
        newErrors.recipient = "Recipient is required";
      } else {
        if (
          transferData.recipientType === "upi" &&
          !validateUPI(transferData.recipient)
        ) {
          newErrors.recipient = "Invalid UPI ID format";
        }
        if (
          transferData.recipientType === "phone" &&
          !validatePhone(transferData.recipient)
        ) {
          newErrors.recipient = "Invalid phone number";
        }
        if (
          transferData.recipientType === "account" &&
          !validateAccount(transferData.recipient)
        ) {
          newErrors.recipient = "Invalid account number";
        }
      }

      // Validate amount
      if (!transferData.amount || parseFloat(transferData.amount) <= 0) {
        newErrors.amount = "Please enter a valid amount";
      }
      if (parseFloat(transferData.amount) > 100000) {
        newErrors.amount = "Amount cannot exceed ₹1,00,000";
      }
    }

    if (step === 2) {
      if (!transferData.pin) {
        newErrors.pin = "PIN is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleTransfer = async () => {
    if (!validateStep(2)) return;

    if (transferData.pin !== "1234") {
      setErrors({ pin: "Invalid PIN" });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Transfer successful:", {
        ...transferData,
        transactionId: `TXN${Date.now()}`,
        timestamp: new Date().toISOString(),
      });

      setCurrentStep(3); // Success step
    } catch (error) {
      setErrors({ submit: "Transfer failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getRecipientPlaceholder = (type) => {
    switch (type) {
      case "upi":
        return "example@paytm";
      case "phone":
        return "9876543210";
      case "account":
        return "Account Number";
      default:
        return "Enter recipient";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mr-4 p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transfer Money</h1>
            <p className="text-gray-600">Send money instantly and securely</p>
          </div>
        </div>

        {/* Progress Bar - Now 3 steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step <= currentStep
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step === 3 && currentStep >= 3 ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 mx-3 transition-all duration-300 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">
                {currentStep === 1 && "Enter Transfer Details"}
                {currentStep === 2 && "Confirm & Pay"}
                {currentStep === 3 && "Transfer Complete"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Step 1: Transfer Details (Combined Recipient + Amount) */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <BanknotesIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Transfer Details
                </h2>
                <p className="text-gray-600">
                  Enter recipient and amount information
                </p>
              </div>

              <div className="space-y-6">
                {/* Recipient Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Transfer Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: "upi", label: "UPI ID", icon: QrCodeIcon },
                      { type: "phone", label: "Phone", icon: PhoneIcon },
                      {
                        type: "account",
                        label: "Account",
                        icon: CreditCardIcon,
                      },
                    ].map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => handleInputChange("recipientType", type)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          transferData.recipientType === type
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recipient Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="h-4 w-4 inline mr-1" />
                    {transferData.recipientType === "upi" && "UPI ID"}
                    {transferData.recipientType === "phone" && "Phone Number"}
                    {transferData.recipientType === "account" &&
                      "Account Number"}
                  </label>
                  <input
                    type="text"
                    value={transferData.recipient}
                    onChange={(e) =>
                      handleInputChange("recipient", e.target.value)
                    }
                    placeholder={getRecipientPlaceholder(
                      transferData.recipientType
                    )}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.recipient ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.recipient && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.recipient}
                    </p>
                  )}
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BanknotesIcon className="h-4 w-4 inline mr-1" />
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={transferData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    placeholder="0.00"
                    className={`w-full p-4 text-xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Amount
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[100, 500, 1000, 5000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() =>
                          handleInputChange("amount", amount.toString())
                        }
                        className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={transferData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    placeholder="Add a note..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Continue Button */}
                <button
                  onClick={nextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm & Pay */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <CheckCircleIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirm Transfer
                </h2>
                <p className="text-gray-600">
                  Review your transfer details and enter PIN
                </p>
              </div>

              {/* Transfer Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Transfer Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">
                      {transferData.recipient}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-2xl text-blue-600">
                      ₹{transferData.amount}
                    </span>
                  </div>
                  {transferData.note && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Note:</span>
                      <span className="font-medium">{transferData.note}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Fee:</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-blue-600">
                      ₹{transferData.amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* PIN Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter UPI PIN
                  </label>
                  <input
                    type="password"
                    value={transferData.pin}
                    onChange={(e) => handleInputChange("pin", e.target.value)}
                    placeholder="Enter your UPI PIN"
                    maxLength={6}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.pin ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.pin && (
                    <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    For demo: use 1234
                  </p>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay ₹${transferData.amount}`
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    disabled={loading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                  <CheckCircleIcon className="h-12 w-12 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Transfer Successful!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your money has been sent successfully
                </p>

                {/* Transaction Details */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Transaction Details
                  </h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono text-sm">TXN{Date.now()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="font-medium">
                        {transferData.recipient}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-green-600">
                        ₹{transferData.amount}
                      </span>
                    </div>
                    {transferData.note && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Note:</span>
                        <span className="font-medium">{transferData.note}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Back to Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setTransferData({
                        recipientType: "upi",
                        recipient: "",
                        amount: "",
                        note: "",
                        pin: "",
                      });
                      setErrors({});
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Send Another Transfer
                  </button>
                </div>

                {/* Success Animation */}
                <div className="mt-8">
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferMoneyPage;
