import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  GiftIcon,
  TrophyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Banking?
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join millions of users who've already discovered the future of
            finance. Get started with CitiChain today and experience blockchain
            banking like never before.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <GiftIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Welcome Bonus</h3>
            <p className="text-blue-100">
              Get 1000 RupeeX tokens and premium features for 3 months free
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Loyalty Rewards
            </h3>
            <p className="text-blue-100">
              Earn Citi Coins through gamified challenges and redeem at Citi
              Shop
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant KYC</h3>
            <p className="text-blue-100">
              Complete AI-powered OneKYC in under 5 minutes with ZK privacy
            </p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center"
            >
              Start Your Journey
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-blue-600 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Trust Indicators
        <div className="text-center">
          <p className="text-blue-200 text-sm mb-6">
            Trusted by 10M+ users • RBI Compliant • ISO 27001 Certified
          </p>
          <div className="flex justify-center items-center space-x-8 text-white/60">
            <span className="text-sm">🏛️ Government Approved</span>
            <span className="text-sm">🔒 Bank-Grade Security</span>
            <span className="text-sm">⚡ 99.9% Uptime</span>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default CTASection;
