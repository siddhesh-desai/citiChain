import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PassportStatusPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [passportNumber, setPassportNumber] = useState(null);
  const [reason, setReason] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  const mockStatus = location.state?.status || "pending";
  const mockReason = location.state?.reason || "Your application is under review.";
  const userId = location.state?.userId || "USER-" + Math.floor(Math.random() * 10000);

  useEffect(() => {
    setTimeout(() => {
      setStatus(mockStatus);
      setReason(mockReason);

      if (mockStatus === "accepted") {
        setPassportNumber(generateUniquePassport());
      }

      setFadeIn(true);
    }, 1000);
  }, [mockStatus]);

  const generateUniquePassport = () => {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const numericPart = Math.floor(100000 + Math.random() * 900000);
    return `CITI-${randomPart}@${numericPart}`;
  };

  const handleRedirect = () => {
    navigate("/logout");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 relative">
      {/* Logout Button */}
      <button
        onClick={handleRedirect}
        className="absolute top-6 right-8 text-sm bg-white bg-opacity-10 text-white px-4 py-1 rounded-md hover:bg-opacity-20 transition"
      >
        Logout
      </button>

      {/* Animated Neon Box */}
      <div className="relative w-full max-w-4xl">
        <div className="absolute inset-0 rounded-3xl pointer-events-none border border-blue-400 border-opacity-10 shadow-[0_0_60px_2px_rgba(0,191,255,0.08)] animate-pulse"></div>

        <div
          className={`transition-all duration-1000 ease-in-out ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          } w-full min-h-[400px] p-12 rounded-3xl shadow-xl bg-white bg-opacity-10 backdrop-blur-lg border border-blue-300 border-opacity-20 text-center text-white`}
        >
          <h2 className="text-4xl font-bold mb-6 tracking-wider">
            {status === "accepted" && "Passport Approved"}
            {status === "declined" && "Application Declined"}
            {status === "pending" && "Application Pending"}
            {status === "error" && "Status Unavailable"}
          </h2>

          <p className="text-base mb-2 text-blue-100">Submission ID: {userId}</p>
          <p className="text-base mb-6 text-blue-100">Reviewed on: {new Date().toLocaleString()}</p>

          {/* Accepted */}
          {status === "accepted" && (
            <>
              <p className="text-lg mb-4">
                Your unique passport number:
                <span className="block mt-2 text-3xl font-semibold text-blue-200 tracking-widest">
                  {passportNumber}
                </span>
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-8 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition"
              >
                Proceed to Login
              </button>
            </>
          )}

          {/* Declined */}
          {status === "declined" && (
            <>
              <p className="text-lg mb-4 text-red-300 font-medium">
                Reason: {reason}
              </p>
              <button
                onClick={handleRedirect}
                className="mt-8 px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}

          {/* Pending */}
          {status === "pending" && (
            <>
              <p className="text-lg mb-4 text-blue-200">{reason}</p>
              <p className="text-sm text-blue-300">Estimated decision within 24-48 hours.</p>
              <button
                onClick={handleRedirect}
                className="mt-8 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <p className="text-lg mb-4 text-red-300">
                Error fetching status. Please try again later.
              </p>
              <button
                onClick={handleRedirect}
                className="mt-8 px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassportStatusPage;
