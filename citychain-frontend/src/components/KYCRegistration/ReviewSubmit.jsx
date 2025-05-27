import React, { useState } from "react";
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ReviewSubmit = ({ formData, prevStep, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Create FormData for file uploads
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "live_photo_preview" && key !== "signature_preview") {
          submitData.append(key, formData[key]);
        }
      });

      // Call the onSubmit function passed from parent
      await onSubmit(submitData);

      setSubmitStatus("success");
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          KYC Submitted Successfully!
        </h2>
        <p className="text-gray-600 mb-4">
          Your KYC application has been submitted for review. You'll receive a
          OneKYC passport once approved.
        </p>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-700">
            <ShieldCheckIcon className="h-4 w-4 inline mr-1" />
            Your data is secured with Zero-Knowledge Proofs and can be used
            across all partner banks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <ShieldCheckIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
        <p className="text-gray-600">Step 4 of 4</p>
      </div>

      <div className="space-y-4">
        {/* Personal Information Review */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            Personal Information
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Name:</span> {formData.fullname}
            </p>
            <p>
              <span className="font-medium">Email:</span> {formData.email}
            </p>
            <p>
              <span className="font-medium">Username:</span> {formData.username}
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {formData.phone_number}
            </p>
            <p>
              <span className="font-medium">DOB:</span> {formData.user_dob}
            </p>
          </div>
        </div>

        {/* Government ID Review */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Government IDs</h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Aadhaar:</span>{" "}
              {formData.aadhaar_number}
            </p>
            <p>
              <span className="font-medium">PAN:</span> {formData.pan_number}
            </p>
          </div>
        </div>

        {/* Documents Review */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Uploaded Documents</h3>
          <div className="flex space-x-4">
            {formData.live_photo_preview && (
              <div className="text-center">
                <img
                  src={formData.live_photo_preview}
                  alt="Live photo"
                  className="w-16 h-16 object-cover rounded-full mx-auto mb-1"
                />
                <p className="text-xs text-gray-600">Live Photo</p>
              </div>
            )}
            {formData.signature_preview && (
              <div className="text-center">
                <img
                  src={formData.signature_preview}
                  alt="Signature"
                  className="w-16 h-8 object-contain mx-auto mb-1 border rounded"
                />
                <p className="text-xs text-gray-600">Signature</p>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Privacy & Security</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • Your data will be processed using AI OCR and facial recognition
            </li>
            <li>• Zero-Knowledge Proofs ensure your privacy is protected</li>
            <li>
              • Once approved, you'll receive a OneKYC passport valid across all
              partner banks
            </li>
            <li>• Your identity will be stored securely on the blockchain</li>
          </ul>
        </div>

        {submitStatus === "error" && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700 text-sm flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
              Submission failed. Please try again.
            </p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={prevStep}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              "Submit KYC Application"
            )}
          </button>
        </div>

        {/* Terms and Conditions */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By submitting, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit;
