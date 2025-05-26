import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const BRAND_BLUE = "#012B52";

export default function RupeeXSetup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [passport, setPassport] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !passport.trim() || pin.length !== 4 || pin !== confirmPin) {
      setError("⚠️ Please fill all fields correctly. PIN must be 4 digits and match.");
      return;
    }

    const formattedPassport = `CITI-${passport.toUpperCase().slice(0, 4)}@${passport.toUpperCase().slice(4, 8)}XYZ`;

    localStorage.setItem("rupeex-name", name.trim());
    localStorage.setItem("rupeex-passport", formattedPassport);
    localStorage.setItem("rupeex-pin", pin);
    localStorage.setItem("rupeex-balance", "266990.00");

    setSetupComplete(true);
    setTimeout(() => navigate("/rupeex"), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f8ff] to-[#e6efff] flex items-center justify-center px-4">
      {setupComplete ? (
        <div className="flex flex-col items-center text-center">
          <CheckCircleIcon className="w-20 h-20 text-green-500 animate-ping mb-4" />
          <h2 className="text-3xl font-bold text-green-700">Setup Complete</h2>
          <p className="text-gray-600 mt-2">Redirecting to your RupeeX Wallet...</p>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-white backdrop-blur-md border border-blue-200 rounded-3xl shadow-lg p-10 space-y-8">
          <div className="flex items-center justify-center gap-3">
            <CheckBadgeIcon className="w-10 h-10 text-[#012B52]" />
            <h1 className="text-3xl font-extrabold text-[#012B52] text-center">
              Activate RupeeX Wallet
            </h1>
          </div>
          <p className="text-center text-gray-600 text-sm -mt-1">
            One-time secure setup to start programmable payments.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Rudrika Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 px-5 py-3 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#012B52] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Passport ID
              </label>
              <input
                type="text"
                placeholder="123X432XHG"
                value={passport}
                onChange={(e) => setPassport(e.target.value.toUpperCase())}
                required
                maxLength={10}
                className="w-full border border-gray-300 px-5 py-3 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#012B52] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Create 4-digit PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="●●●●"
                  required
                  className="w-full text-center tracking-widest text-2xl font-extrabold border border-gray-300 px-5 py-3 rounded-lg shadow-inner bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#012B52] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="●●●●"
                  required
                  className="w-full text-center tracking-widest text-2xl font-extrabold border border-gray-300 px-5 py-3 rounded-lg shadow-inner bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#012B52] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#012B52] hover:bg-blue-900 text-white py-4 rounded-full font-semibold shadow-lg transition duration-300"
            >
              🚀 Set Up Wallet
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 pt-3 select-none">
            This wallet is simulated for demo. Your data is saved in-browser only.
          </p>
        </div>
      )}
    </div>
  );
}