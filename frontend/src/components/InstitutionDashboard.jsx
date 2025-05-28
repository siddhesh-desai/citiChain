import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "AI OneKYC",
    description: "One-time verification using ZKPs, facial scan & OCR.",
  },
  {
    title: "Reputation Passport",
    description: "Decentralized, tamper-proof identity & credit profile.",
  },
  {
    title: "Consent Ledger",
    description: "Smart contract-powered access logs with IPFS & Merkle trees.",
  },
  {
    title: "Smart Loans",
    description: "Use-case specific lending for verified institutions.",
  },
  {
    title: "Tokenized EMI",
    description: "Smart contract-based repayments, spending rules & Chainlink oracles.",
  },
  {
    title: "citiGPT Assistant",
    description: "24/7 AI guide for finances, compliance & onboarding.",
  },
];

export default function InstitutionDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("rememberedInstitution");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040D25] to-[#1E40AF] flex text-white relative">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#1E3A8A] to-[#1E40AF] border-r border-blue-700/50 shadow-lg p-6 flex flex-col space-y-6 z-20 text-white">
        <h1 className="text-2xl font-bold mb-6 tracking-wide">CitiChain</h1>
        <nav className="flex flex-col space-y-4 text-base font-medium">
          <button onClick={() => navigate("/institution/dashboard")} className="text-left hover:text-blue-300 transition duration-200">
            Dashboard
          </button>
          <button className="text-left hover:text-blue-300 transition duration-200">Institution KYC</button>
          <button className="text-left hover:text-blue-300 transition duration-200">Reputation Passport</button>
          <button className="text-left hover:text-blue-300 transition duration-200">Consent Ledger</button>
          <button className="text-left hover:text-blue-300 transition duration-200">Smart Loans</button>

          <button
            onClick={handleLogout}
            className="mt-8 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-center font-semibold transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 z-10 overflow-y-auto">
        <h2 className="text-4xl font-bold mb-2 text-white">Welcome!</h2>
        <p className="text-white/70 mb-10">
          Your decentralized control center to manage identity, credit, compliance, and smart loans.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/50 transition duration-300 backdrop-blur-md"
            >
              <h3 className="text-xl font-semibold text-blue-300 mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
