import React, { useState } from "react";
import {
  CameraIcon,
  DocumentIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const DocumentUpload = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  const validateStep = () => {
    const newErrors = {};

    if (!formData.live_photo) newErrors.live_photo = "Live photo is required";
    if (!formData.signature) newErrors.signature = "Signature is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    // Validate file type
    const allowedTypes =
      type === "live_photo"
        ? ["image/jpeg", "image/jpg", "image/png"]
        : ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        [type]: "Please upload a valid image file (JPG, PNG)",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, [type]: "File size must be less than 5MB" });
      return;
    }

    setUploading({ ...uploading, [type]: true });

    // Simulate upload process (replace with actual Cloudinary upload)
    setTimeout(() => {
      const fileUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        [type]: file,
        [`${type}_preview`]: fileUrl,
      });
      setUploadStatus({ ...uploadStatus, [type]: "uploaded" });
      setUploading({ ...uploading, [type]: false });

      // Clear any previous errors
      const newErrors = { ...errors };
      delete newErrors[type];
      setErrors(newErrors);
    }, 1500);
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <CameraIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
        <p className="text-gray-600">Step 3 of 4</p>
      </div>

      <div className="space-y-6">
        {/* Live Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Live Photo *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            {formData.live_photo_preview ? (
              <div className="space-y-2">
                <img
                  src={formData.live_photo_preview}
                  alt="Live photo preview"
                  className="w-24 h-24 object-cover rounded-full mx-auto"
                />
                {uploadStatus.live_photo === "uploaded" && (
                  <p className="text-green-600 text-sm flex items-center justify-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Photo uploaded successfully
                  </p>
                )}
              </div>
            ) : (
              <div>
                <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload your live photo
                </p>
              </div>
            )}

            {uploading.live_photo ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Uploading...</span>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload(e.target.files[0], "live_photo")
                }
                className="hidden"
                id="live_photo"
              />
            )}

            {!uploading.live_photo && (
              <label
                htmlFor="live_photo"
                className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 inline-block"
              >
                {formData.live_photo ? "Change Photo" : "Choose Photo"}
              </label>
            )}
          </div>
          {errors.live_photo && (
            <p className="text-red-500 text-sm mt-1">{errors.live_photo}</p>
          )}
        </div>

        {/* Signature Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Digital Signature *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            {formData.signature_preview ? (
              <div className="space-y-2">
                <img
                  src={formData.signature_preview}
                  alt="Signature preview"
                  className="w-32 h-16 object-contain mx-auto border rounded"
                />
                {uploadStatus.signature === "uploaded" && (
                  <p className="text-green-600 text-sm flex items-center justify-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Signature uploaded successfully
                  </p>
                )}
              </div>
            ) : (
              <div>
                <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload your signature
                </p>
              </div>
            )}

            {uploading.signature ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Uploading...</span>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileUpload(e.target.files[0], "signature")
                }
                className="hidden"
                id="signature"
              />
            )}

            {!uploading.signature && (
              <label
                htmlFor="signature"
                className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 inline-block"
              >
                {formData.signature ? "Change Signature" : "Choose Signature"}
              </label>
            )}
          </div>
          {errors.signature && (
            <p className="text-red-500 text-sm mt-1">{errors.signature}</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">
            AI-Powered Verification
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• OCR technology will extract and verify document details</li>
            <li>• Facial recognition will match your live photo</li>
            <li>• Zero-Knowledge Proofs ensure privacy protection</li>
          </ul>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={prevStep}
            className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={Object.values(uploading).some(Boolean)}
            className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
