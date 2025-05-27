import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, SkipForward, Eye } from "lucide-react";

export default function KYCStartDecision() {
  const navigate = useNavigate();

  const startNewKYC = () => navigate("/kyc/upload");
  const skipKYC = () => navigate("/dashboard");
  const viewStatus = () => navigate("/kyc/status");

  return (
    <div className="min-h-screen font-sans bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 flex flex-col md:flex-row items-center justify-center px-6 py-12">
      {/* Left Side */}
      <div className="w-full md:w-1/2 p-6 md:p-12">
        <img
          src={require("../assets/undraw_credit-card_t6qm (1).svg").default}
          alt="Secure KYC"
          className="w-full max-w-md mx-auto animate-float"
        />
        <h1 className="text-4xl font-bold text-[#1E40AF] mt-6 text-center leading-tight">
          Verify once, trust forever.
        </h1>
        <p className="text-gray-700 text-center mt-3 text-base max-w-md mx-auto">
          CitiChain KYC provides a smooth, reliable, and secure onboarding experience for everyone.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 p-6 md:p-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-blue-200">
          <h2 className="text-2xl font-bold text-[#1E40AF] text-center">
            Get started with your KYC
          </h2>
          <p className="text-gray-600 text-center mt-2 mb-6">
            Quick, easy, and secure verification to access all features.
          </p>

          <div className="space-y-4">
            <button
              onClick={startNewKYC}
              className="w-full py-3 flex items-center justify-center gap-2 bg-[#1E40AF] hover:bg-[#163c8d] text-white font-semibold rounded-xl transition duration-200"
            >
              <ShieldCheck className="w-5 h-5" />
              Start KYC
            </button>

            {/* <button
              onClick={skipKYC}
              className="w-full py-3 flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-[#1E40AF] font-semibold rounded-xl transition duration-200"
            >
              <SkipForward className="w-5 h-5" />
              Skip KYC for Now
            </button> */}

            <button
              onClick={viewStatus}
              className="w-full py-3 flex items-center justify-center gap-2 bg-white border border-blue-300 hover:bg-blue-50 text-[#1E40AF] font-semibold rounded-xl transition duration-200"
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
