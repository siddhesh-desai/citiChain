import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, SkipForward, Eye } from "lucide-react";

export default function KYCStartDecision() {
  const navigate = useNavigate();

  const startNewKYC = () => navigate("/kyc/upload");
  const skipKYC = () => navigate("/dashboard");
  const viewStatus = () => navigate("/kyc/status");

  return (
    <div className="min-h-screen font-sans bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-100 flex flex-col md:flex-row items-center justify-center px-6 py-12">
      {/* Left Side */}
      <div className="w-full md:w-1/2 p-6 md:p-12">
        <img
          src={require("../assets/undraw_credit-card_t6qm.svg").default}
          alt="Secure KYC"
          className="w-full max-w-md mx-auto animate-float"
        />
        <h1 className="text-4xl font-bold text-indigo-700 mt-6 text-center leading-tight">
          Verify once, trust forever.
        </h1>
        <p className="text-gray-600 text-center mt-3 text-base max-w-md mx-auto">
          CitiChain KYC provides a smooth, reliable, and secure onboarding experience for everyone.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 p-6 md:p-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-indigo-800 text-center">
            Get started with your KYC
          </h2>
          <p className="text-gray-500 text-center mt-2 mb-6">
            Quick, easy, and secure verification to access all features.
          </p>

          <div className="space-y-4">
            <button
              onClick={startNewKYC}
              className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200"
            >
              <ShieldCheck className="w-5 h-5" />
              Start New KYC
            </button>

            <button
              onClick={skipKYC}
              className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold rounded-xl transition duration-200"
            >
              <SkipForward className="w-5 h-5" />
              Skip KYC for Now
            </button>

            <button
              onClick={viewStatus}
              className="w-full py-3 flex items-center justify-center gap-2 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 font-semibold rounded-xl transition duration-200"
            >
              <Eye className="w-5 h-5" />
              View KYC Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
