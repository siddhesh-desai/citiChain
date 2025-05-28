import React, { useState } from "react";
import PersonalInfo from "../components/KYCRegistration/PersonalInfo";
import GovernmentID from "../components/KYCRegistration/GovernmentID";
import DocumentUpload from "../components/KYCRegistration/DocumentUpload";
import ReviewSubmit from "../components/KYCRegistration/ReviewSubmit";
import {
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  DocumentCheckIcon,
  BanknotesIcon,
  UserGroupIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const KYCRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (submitData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("KYC Registration successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("KYC Registration failed:", error);
      throw error;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfo
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <GovernmentID
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <DocumentUpload
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <ReviewSubmit
            formData={formData}
            prevStep={prevStep}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const benefits = [
    {
      icon: ShieldCheckIcon,
      title: "Secure & Trusted",
      description:
        "Bank-grade security with end-to-end encryption for all your personal data",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: ClockIcon,
      title: "One-Time Process",
      description:
        "Complete KYC once and use it across multiple financial institutions",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: GlobeAltIcon,
      title: "Universal Access",
      description:
        "Access banking services from anywhere with your oneKYC passport",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: DocumentCheckIcon,
      title: "Digital Verification",
      description:
        "Instant verification with AI-powered document authentication",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      icon: BanknotesIcon,
      title: "Financial Freedom",
      description: "Open multiple bank accounts without repeating KYC process",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: LockClosedIcon,
      title: "Privacy Protected",
      description: "Your data is encrypted and stored securely on blockchain",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const features = [
    "✓ Instant verification process",
    "✓ Blockchain-secured data storage",
    "✓ Multi-bank compatibility",
    "✓ 24/7 customer support",
    "✓ Mobile-first design",
    "✓ Government compliance",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex">
        {/* Left Side - Benefits & Highlights */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex flex-col justify-center px-12 py-16">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                  <UserGroupIcon className="h-6 w-6 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold">oneKYC</h1>
              </div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Your Digital Identity,
                <br />
                <span className="text-blue-200">Simplified</span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Complete your KYC once and unlock seamless access to financial
                services across the CitiChain ecosystem.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div
                    className={`${benefit.bgColor} ${benefit.color} p-2 rounded-lg`}
                  >
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features List */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircleIcon className="h-6 w-6 mr-2 text-green-300" />
                <span className="text-green-500">What You Get</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="text-blue-600 text-sm">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex-1 py-12 px-4 sm:px-6 lg:px-12">
            <div className="max-w-2xl mx-auto">
              {/* Mobile Header - Only visible on small screens */}
              <div className="lg:hidden mb-8 text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  oneKYC Registration
                </h1>
                <p className="text-gray-600">
                  Complete your digital identity verification
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                          step <= currentStep
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step < currentStep ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                          step
                        )}
                      </div>
                      {step < 4 && (
                        <div
                          className={`w-16 h-1 mx-2 transition-all duration-300 ${
                            step < currentStep ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-medium">
                      Step {currentStep} of 4
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentStep === 1 && "Personal Information"}
                      {currentStep === 2 && "Government ID Verification"}
                      {currentStep === 3 && "Document Upload"}
                      {currentStep === 4 && "Review & Submit"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                {renderStep()}
              </div>

              {/* Help Section */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Need help? Contact our support team at{" "}
                  <a
                    href="mailto:support@citichain.com"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    support@citichain.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCRegistration;
