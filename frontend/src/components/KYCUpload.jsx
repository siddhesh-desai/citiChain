import { CloudUpload } from "lucide-react";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";

const requiredDocs = [
  { id: "govt_id_front", label: "Government ID Front", required: true, keywords: ["id", "government", "passport", "pan", "aadhaar"] },
  { id: "govt_id_back", label: "Government ID Back", required: true, keywords: ["id", "government", "passport", "pan", "aadhaar"] },
  { id: "proof_of_address", label: "Proof of Address", required: true, keywords: ["address", "utility", "bill", "ration card", "passport"] },
  { id: "signature", label: "Signature (Optional)", required: false, keywords: [] },
];

const allowedTypes = ["image/jpeg", "image/png", "application/pdf", "image/jpg"];
const maxSizeMB = 5;

export default function KYCUpload() {
  const [documents, setDocuments] = useState({});
  const [ocrData, setOcrData] = useState({});
  const [loadingDoc, setLoadingDoc] = useState(null);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef({});
  const navigate = useNavigate();

  // Helper to check if OCR text contains any required keywords for that document
  const validateOCRText = (text, keywords) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return keywords.some((keyword) => lowerText.includes(keyword.toLowerCase()));
  };

  const handleFileUpload = (docId, file) => {
    // Reset errors
    setErrors((prev) => ({ ...prev, [docId]: null }));

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [docId]: "Invalid file type. Use JPG, PNG, or PDF." }));
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [docId]: "File too large. Max size 5MB." }));
      return;
    }

    setDocuments((prev) => ({ ...prev, [docId]: file }));
    setOcrData((prev) => ({ ...prev, [docId]: null }));

    if (file.type === "application/pdf") {
      // Skip OCR for PDF, just mark as uploaded
      setOcrData((prev) => ({ ...prev, [docId]: "PDF uploaded - OCR skipped" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setLoadingDoc(docId);
      try {
        const { data: { text } } = await Tesseract.recognize(reader.result, "eng", {
          logger: (m) => console.log(docId, m.status, m.progress),
        });

        // Validate extracted text against required keywords
        const docInfo = requiredDocs.find((d) => d.id === docId);
        const isValidOCR = docInfo && docInfo.required ? validateOCRText(text, docInfo.keywords) : true;

        if (!isValidOCR) {
          setErrors((prev) => ({
            ...prev,
            [docId]: `OCR text invalid or missing required info for ${docInfo.label}. Please upload a valid document.`,
          }));
          setOcrData((prev) => ({ ...prev, [docId]: null }));
        } else {
          setOcrData((prev) => ({ ...prev, [docId]: text }));
          setErrors((prev) => ({ ...prev, [docId]: null }));
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, [docId]: "OCR failed. Please try again with a clearer image." }));
        setOcrData((prev) => ({ ...prev, [docId]: null }));
      } finally {
        setLoadingDoc(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = (id) => {
    inputRefs.current[id]?.click();
  };

  // Check if all required docs are uploaded and OCR passed validation (no errors)
  const allRequiredUploaded = requiredDocs.every(({ id, required }) => {
    if (!required) return true;
    return documents[id] && ocrData[id] && !errors[id];
  });

  const handleContinue = () => {
    if (!allRequiredUploaded) return;
    localStorage.setItem("kyc_docs", JSON.stringify(ocrData));
    console.log("KYC documents ready:", ocrData);

    // Add a json to previously stored user data
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    userData.document_links = {
      "pan": "https://example.com/pan.jpg",
      "aadhar": "https://example.com/aadhar.jpg"
    }
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("Updated user data with document links:", userData);
    navigate("/kyc/photo");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E40AF] via-[#3B82F6] to-[#1E40AF] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
        <h1 className="text-2xl font-semibold text-center mb-1">Upload Your KYC Documents</h1>
        <p className="text-sm text-center text-white/70 mb-6">
          Upload all required documents to proceed. JPG, PNG, PDF accepted.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {requiredDocs.map(({ id, label, required }) => (
            <div key={id} className="bg-white/10 p-5 rounded-2xl border-2 border-white/30 hover:border-indigo-500 hover:bg-white/20 transition-all duration-300 cursor-pointer min-h-[130px] flex flex-col justify-center items-center text-center"
              onClick={() => openFileDialog(id)}
            >
              {!documents[id] ? (
                <>
                  <CloudUpload className="mx-auto mb-2 animate-pulse" size={36} />
                  <p className="text-white/70 font-medium">{label} {required && <span className="text-red-400">*</span>}</p>
                  <p className="text-xs text-white/50 mt-1">Click to upload</p>
                </>
              ) : (
                <p className="text-sm truncate font-semibold text-[#1E40AF]">{documents[id].name}</p>
              )}

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                ref={(el) => (inputRefs.current[id] = el)}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(id, e.target.files[0]);
                  }
                }}
              />
              {loadingDoc === id && (
                <p className="mt-2 text-white text-sm">Parsing with AI…</p>
              )}
              {ocrData[id] && !loadingDoc && !errors[id] && (
                <p className="mt-2 text-white text-sm select-text truncate max-w-full">OCR Done!</p>
              )}
              {errors[id] && (
                <p className="text-white text-sm mt-1 font-semibold">{errors[id]}</p>
              )}

            </div>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!allRequiredUploaded}
          className={`mt-8 w-full py-3 rounded-xl font-semibold tracking-wide transition duration-300 text-white ${allRequiredUploaded
            ? "bg-[#1E40AF] hover:bg-[#3B82F6] cursor-pointer"
            : "bg-gray-500 cursor-not-allowed text-white/70"
            }`}
        >
          Continue to Live Photo →
        </button>
      </div>
    </div>
  );
}
