import React, { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const CitiGPTShowcase = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  const demoConversations = [
    {
      title: "Smart Financial Insights",
      messages: [
        { type: "user", text: "How can I optimize my spending this month?" },
        {
          type: "bot",
          text: "Based on your transaction history, you've spent 35% more on food delivery. I recommend setting a ₹3,000 monthly limit and using RupeeX rewards for groceries. This could save you ₹2,500/month!",
        },
      ],
    },
    {
      title: "Loan Guidance",
      messages: [
        { type: "user", text: "I need an education loan for my MBA" },
        {
          type: "bot",
          text: "Perfect! With your credit score of 812, you qualify for our Smart Education Loan at 8.5% APR. The loan will be tokenized and can only be used at verified institutions. Would you like me to start the application?",
        },
      ],
    },
    {
      title: "Investment Advice",
      messages: [
        { type: "user", text: "Should I invest in crypto or mutual funds?" },
        {
          type: "bot",
          text: "Given your risk profile and ₹50K monthly surplus, I suggest 60% in diversified mutual funds and 40% in RupeeX staking (12% APY). This balances growth with stability. Want me to set up auto-investments?",
        },
      ],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div>
            <div className="flex items-center mb-6">
              <SparklesIcon className="h-8 w-8 text-blue-600 mr-3" />
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                AI-Powered Assistant
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet CitiGPT
              <span className="block text-blue-600">
                Your 24/7 Financial Guide
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Built with RAG + AI agents, CitiGPT provides intelligent financial
              guidance, tracks your goals, and delivers personalized insights
              based on your unique financial behavior and blockchain data.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Real-time transaction analysis and spending insights
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Personalized investment and loan recommendations
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Smart contract interaction and DeFi guidance
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">
                  Goal tracking and automated financial planning
                </span>
              </div>
            </div>

            {/* Demo Selector */}
            <div className="flex space-x-2 mb-4">
              {demoConversations.map((demo, index) => (
                <button
                  key={index}
                  onClick={() => setActiveDemo(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDemo === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {demo.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Chat Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center mb-6">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-900">
                  CitiGPT Demo
                </span>
                <div className="ml-auto flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>

              <div className="space-y-4 h-64 overflow-y-auto">
                {demoConversations[activeDemo].messages.map(
                  (message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-4 flex items-center p-3 bg-white rounded-lg border border-gray-200">
                <input
                  type="text"
                  placeholder="Ask CitiGPT anything..."
                  className="flex-1 outline-none text-sm"
                  disabled
                />
                <button className="ml-2 bg-blue-600 text-white p-2 rounded-lg">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">
              🤖 AI Powered
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-3 py-1 rounded-full text-xs font-medium">
              💬 24/7 Available
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CitiGPTShowcase;
