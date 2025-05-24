import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OTPVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, email, name } = location.state || {};

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sentOtp] = useState("123456"); // Mock OTP
  const [resendMessage, setResendMessage] = useState("");

  const alertShown = useRef(false);

  useEffect(() => {
    if (phone && !alertShown.current) {
      alert(`OTP sent to your registered mobile: ${sentOtp} for ${phone}`);
      alertShown.current = true; // mark alert as shown
    }
  }, [phone, sentOtp]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d{0,6}$/.test(val)) {
      setOtp(val);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp === sentOtp) {
      setError("");
      alert("OTP verified successfully!");
      navigate("/dashboard");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const resendOtp = () => {
    setResendMessage("A new OTP has been sent to your registered number.");
    setTimeout(() => setResendMessage(""), 4000);
    alert(`Mock OTP resent: ${sentOtp}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
      <main
        role="region"
        aria-labelledby="otp-title"
        className="max-w-md w-full bg-white shadow-md rounded-lg p-8"
      >
        <h1
          id="otp-title"
          className="text-3xl font-semibold text-gray-800 mb-3 text-center"
          tabIndex={-1}
        >
          Secure OTP Verification
        </h1>
        <p className="text-center text-gray-600 mb-2">
          Hi <strong>{name || "User"}</strong>, please enter the 6-digit OTP sent to your registered mobile number:
        </p>
        <p className="text-center text-gray-700 mb-6 font-mono">{phone || "No phone number provided"}</p>

        {resendMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-2 rounded mb-4 text-center">
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={otp}
            onChange={handleChange}
            maxLength={6}
            placeholder="Enter OTP"
            aria-label="Enter OTP"
            className="w-full px-4 py-3 mb-3 border rounded-lg text-center text-lg tracking-widest border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            autoComplete="one-time-code"
          />
          {error && (
            <p className="text-red-600 text-sm mb-3" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Verify OTP and continue"
          >
            Verify & Continue
          </button>
        </form>

        <div className="mt-5 text-sm text-gray-600 text-center">
          Didn't receive the OTP?{" "}
          <button
            onClick={resendOtp}
            className="text-indigo-600 font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded"
            aria-label="Resend OTP"
          >
            Resend OTP
          </button>
        </div>

        <footer className="mt-6 text-xs text-gray-400 text-center select-none">
          © 2025 EliteBank Corp. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
