import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CitiChain</h3>
            <p className="text-gray-400 mb-4">
              The future of blockchain banking - transparent, secure, and
              innovative.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Discord
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Digital Banking
                </Link>
              </li>
              <li>
                <Link to="/kyc" className="hover:text-white transition-colors">
                  OneKYC
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  RupeeX Token
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Smart Loans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Reputation Passport
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  CitiGPT
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <span className="text-gray-400 text-sm">
                © 2025 CitiChain. All rights reserved.
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Powered by:</span>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>Ethereum</span>
                <span>•</span>
                <span>Chainlink</span>
                <span>•</span>
                <span>IPFS</span>
                <span>•</span>
                <span>Semaphore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              <span className="font-medium text-white">Regulatory Notice:</span>{" "}
              CitiChain operates under RBI guidelines and maintains full
              compliance with Indian banking regulations.
            </div>
            <div className="flex items-center space-x-4">
              <span>📱 Mobile App Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
