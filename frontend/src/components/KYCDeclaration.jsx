import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KYCDeclaration() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreed) {
      setError("You must agree to the declaration before proceeding.");
      return;
    }

    setError("");
    navigate("/kyc/review");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow max-w-2xl w-full"
        aria-labelledby="declaration-title"
      >
        <h2
          id="declaration-title"
          className="text-2xl font-bold mb-6 text-gray-800"
        >
          KYC Declaration & Consent
        </h2>

        <div className="mb-6 text-gray-700 space-y-4">
          <p>
            I hereby declare that the information provided by me is true and correct to the best of my knowledge.
          </p>
          <p>
            I authorize CitiChain to use and verify the documents and information submitted for the purpose of completing my KYC in compliance with the Reserve Bank of India (RBI) norms.
          </p>
          <p>
            I understand that providing false information or documents is punishable under the Indian Penal Code.
          </p>
        </div>

        <div className="mb-6">
          <input
            type="checkbox"
            id="declaration-agree"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setError("");
            }}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            aria-describedby="declaration-error"
          />
          <label
            htmlFor="declaration-agree"
            className="ml-2 text-gray-800 font-medium cursor-pointer select-none"
          >
            I agree to the above declaration.
          </label>
          {error && (
            <p
              id="declaration-error"
              className="text-red-500 text-sm mt-2"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!agreed}
          className={`w-full py-3 rounded font-semibold text-white transition ${
            agreed
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }`}
          aria-disabled={!agreed}
        >
          Submit & Proceed to Review
        </button>
      </form>
    </div>
  );
}
