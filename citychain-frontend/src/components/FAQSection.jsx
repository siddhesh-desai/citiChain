import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question:
        "What is CitiChain and how is it different from traditional banks?",
      answer:
        "CitiChain is a blockchain-based banking platform that combines traditional banking services with DeFi innovation. We offer features like RupeeX stablecoin, AI-powered OneKYC, and smart contracts for loans - all while maintaining regulatory compliance and bank-grade security.",
    },
    {
      question: "How secure is the AI OneKYC process?",
      answer:
        "Our OneKYC uses Zero-Knowledge Proofs (ZKPs) via Semaphore protocol, ensuring your identity is verified without exposing sensitive data. Combined with AI-powered OCR and facial recognition, it's more secure than traditional KYC while being privacy-first.",
    },
    {
      question: "What is RupeeX and how does it work?",
      answer:
        "RupeeX is our INR-pegged stablecoin built on Ethereum (ERC-20). It's backed 1:1 with Indian Rupees, enabling instant, low-cost transactions while maintaining price stability. You can use RupeeX for payments, transfers, and DeFi activities.",
    },
    {
      question: "How do Smart Loans prevent fraud?",
      answer:
        "Smart Loans are tokenized and can only be used at verified institutions through our merchant registry system. The smart contracts automatically ensure funds are used for their intended purpose (education, healthcare, etc.), significantly reducing fraud.",
    },
    {
      question: "What is a Reputation Passport?",
      answer:
        "Your Reputation Passport is a Soulbound NFT that stores your financial identity, credit history, and transaction behavior. It's owned by you, portable across banks, and enables better loan terms and financial services based on your proven track record.",
    },
    {
      question: "Is CitiChain regulated and compliant?",
      answer:
        "Yes, CitiChain operates under RBI guidelines and maintains full regulatory compliance. We're ISO 27001 certified and work with traditional banks to ensure seamless integration while providing blockchain innovation.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about CitiChain's revolutionary banking
            platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <h3 className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>

              {openFAQ === index && (
                <div className="px-6 py-4 bg-white">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
