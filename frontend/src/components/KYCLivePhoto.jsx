import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { Camera, UploadCloud, RefreshCw, AlertCircle } from "lucide-react";
import * as faceapi from "face-api.js";

const videoConstraints = {
  width: 360,
  height: 360,
  facingMode: "user",
};

export default function KYCLivePhoto() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [faceWarning, setFaceWarning] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  const validateFace = async (image) => {
    const img = new Image();
    img.src = image;
    await new Promise((resolve) => (img.onload = resolve));

    const detection = await faceapi.detectAllFaces(
      img,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detection.length === 0) {
      setFaceWarning("No face detected. Please ensure your full face is visible.");
      return false;
    } else if (detection.length > 1) {
      setFaceWarning("Multiple faces detected. Only one person should be in frame.");
      return false;
    } else {
      setFaceWarning("");
      return true;
    }
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const isValid = await validateFace(imageSrc);
    if (isValid) {
      setCapturedImage(imageSrc);
    }
  }, []);

  const handleFileUpload = async (e) => {
    setUploadError("");
    setFaceWarning("");
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setUploadError("Please upload a JPG or PNG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const image = reader.result;
      const isValid = await validateFace(image);
      if (isValid) {
        setCapturedImage(image);
      }
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setCapturedImage(null);
    setUploadError("");
    setFaceWarning("");
  };

  const handleContinue = () => {
    alert("Photo verified and saved! Proceeding to review.");
    navigate("/kyc/review");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] via-[#e5e7eb] to-[#f9fafb] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-3xl p-10 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <Camera className="w-14 h-14 text-[#1E40AF] mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-[#1E40AF] text-center">Live Photo Verification</h2>
          <p className="text-[#3B82F6] text-sm text-center mt-2">
            Click a live photo or upload from your device. Our AI will verify your identity.
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner">
            {!capturedImage ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={320}
                  height={320}
                  videoConstraints={videoConstraints}
                  className="rounded-xl shadow-md border border-gray-300"
                />
                <button
                  onClick={capture}
                  className="mt-6 w-full py-3 bg-[#1E40AF] hover:bg-[#1A368C] text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" /> Capture Photo
                </button>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#1E40AF] mb-2">Or upload a photo</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileUpload}
                    className="w-full border border-[#1E40AF] rounded-lg p-2 text-sm file:bg-[#3B82F6] file:border-none file:mr-4 file:px-4 file:py-2 file:rounded file:text-[#1E40AF] file:font-semibold"
                  />
                  {uploadError && <p className="text-red-600 mt-2 font-semibold">{uploadError}</p>}
                  {faceWarning && (
                    <p className="text-yellow-600 mt-2 font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {faceWarning}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="rounded-xl shadow-md max-h-96 max-w-full object-contain border border-gray-300"
                />
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={reset}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5 text-[#1E40AF]" /> Retake
                  </button>
                  <button
                    onClick={handleContinue}
                    className="flex-1 py-3 bg-[#1E40AF] hover:bg-[#1A368C] text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-5 h-5" /> Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
