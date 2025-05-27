import React from "react";
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const FeaturesGrid = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: "AI OneKYC with ZKPs",
      description:
        "One-time KYC for all banks. AI-powered onboarding with OCR, facial scan, and Zero-Knowledge Proofs via Semaphore for privacy-first identity.",
      color: "from-green-500 to-emerald-500",
      badge: "Privacy First",
    },
    {
      icon: CurrencyDollarIcon,
      title: "RupeeX Stablecoin",
      description:
        "INR-pegged fiat-backed ERC-20 token for fast, secure, real-time transactions with blockchain-native stability.",
      color: "from-blue-500 to-cyan-500",
      badge: "Instant Transfers",
    },
    {
      icon: DocumentCheckIcon,
      title: "Reputation Passport",
      description:
        "Own your financial shareable identity. Decentralized wallet storing credit, transaction, and behavior data — issued as Soulbound NFTs + DIDs.",
      color: "from-purple-500 to-indigo-500",
      badge: "Soulbound NFT",
    },
    {
      icon: ChartBarIcon,
      title: "Consent Ledger",
      description:
        "Tamper-proof data access history using Merkle Trees + IPFS. Smart contract-powered permissions with selective sharing.",
      color: "from-orange-500 to-red-500",
      badge: "Tamper-Proof",
    },
    {
      icon: AcademicCapIcon,
      title: "Smart Loans",
      description:
        "Loans/Scholarships can only be used at verified institutions via industry-tagged merchant registry. Reduces fraud, ensures purpose-driven lending.",
      color: "from-teal-500 to-green-500",
      badge: "Fraud Protection",
    },
    {
      icon: CogIcon,
      title: "Tokenized EMI & Lending",
      description:
        "Smart contract-driven loans with automated repayments, spending controls, and dynamic tracking. Powered by Chainlink, Solidity & TimeLocks.",
      color: "from-pink-500 to-rose-500",
      badge: "Automated",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionary Banking Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience next-generation banking with blockchain innovation,
            AI-powered security, and programmable financial services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  {feature.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
