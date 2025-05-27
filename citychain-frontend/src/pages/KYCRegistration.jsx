import React, { useState } from "react";
import PersonalInfo from "../components/KYCRegistration/PersonalInfo";
import GovernmentID from "../components/KYCRegistration/GovernmentID";
import DocumentUpload from "../components/KYCRegistration/DocumentUpload";
import ReviewSubmit from "../components/KYCRegistration/ReviewSubmit";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Step {currentStep} of 4</p>
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
        {renderStep()}
      </div>
    </div>
  );
};

export default KYCRegistration;
