import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OTPVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (otp === "123456") {
      navigate("/dashboard");
    } else {
      setError("Incorrect OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Verify OTP
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit OTP sent to your registered mobile number.
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Submit & Continue
        </button>
      </div>
    </div>
  );
}
