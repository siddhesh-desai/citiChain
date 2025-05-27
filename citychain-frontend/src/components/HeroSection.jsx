import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#040D25] via-[#1E40AF] to-[#3B82F6] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400 opacity-10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            The Future of
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Blockchain Banking
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            CitiChain seamlessly connects blockchain innovation with traditional
            banking — delivering transparency, speed, and security in one
            unified platform.
          </p>
        </div>
        {/* Key Value Props */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🏦</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Traditional + DeFi
            </h3>
            <p className="text-blue-200 text-sm">
              Hybrid system bridging CeFi and DeFi for regulated, efficient
              banking
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Zero-Knowledge Privacy
            </h3>
            <p className="text-blue-200 text-sm">
              AI OneKYC with ZKPs ensures privacy-first identity verification
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              RupeeX Stablecoin
            </h3>
            <p className="text-blue-200 text-sm">
              INR-pegged blockchain-native token for instant transactions
            </p>
          </div>
        </div>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row my-5 gap-4 justify-center items-center">
          <Link
            to="/register"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg flex items-center"
          >
            Start Your Journey
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
          <button className="bg-white/20 backdrop-blur-lg text-white px-8 py-4 rounded-full font-medium border border-white/30 hover:bg-white/30 transition-all flex items-center">
            <PlayIcon className="mr-2 h-5 w-5" />
            Watch Demo
          </button>
        </div>

        {/* <div className="mt-12 text-center">
          <p className="text-blue-200 text-sm mb-4">
            Trusted by 10M+ users worldwide
          </p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-white font-semibold">🏛️ RBI Compliant</div>
            <div className="text-white font-semibold">🔒 ISO 27001</div>
            <div className="text-white font-semibold">⚡ 99.9% Uptime</div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
