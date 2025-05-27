import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import emailIllustration from "../assets/undraw_certification_i2m0.svg";

export default function PassportStatusEntry() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ emailOrId: "", password: "", otp: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.emailOrId || !form.password) {
      setError("Please fill in both Email/Application ID and Password.");
      return;
    }
    setError("");
    setStep(2); // Go to OTP step
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (form.otp !== "123456") {
      setError("Invalid OTP. Please try again.");
      return;
    }
    setError("");
    navigate("/passport-status-page", { state: { userId: form.emailOrId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040D25] to-[#1E40AF] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background animation blobs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl top-[-10%] left-[-10%]"
        style={{
          background: "radial-gradient(circle at center, #0e1a5c, #040d25)",
          boxShadow: "0 0 20px 2px rgba(255,255,255,0.07)",
        }}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl bottom-[-10%] right-[-10%]"
        style={{
          background: "radial-gradient(circle at center, #123a9c, #0a184a)",
          boxShadow: "0 0 20px 2px rgba(255,255,255,0.07)",
        }}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Main content */}
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-24 z-10">
        {/* Left Image */}
        <motion.div
          initial={{ scale: 0.95, y: 0 }}
          animate={{ scale: 1, y: [-15, 15, -15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-[520px]"
        >
          <img
            src={emailIllustration}
            alt="Email Verification"
            className="w-full h-auto select-none"
            draggable={false}
          />
        </motion.div>

        {/* Right Form */}
        <div
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border rounded-3xl p-12 space-y-8"
          style={{
            borderColor: "rgba(255, 255, 255, 0.12)",
            boxShadow: "0 0 8px 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2 className="text-3xl font-extrabold text-center text-white drop-shadow-lg tracking-wide">
            {step === 1 ? "Check Passport Status" : "Enter OTP"}
          </h2>

          <form
            onSubmit={step === 1 ? handleNext : handleVerify}
            className="space-y-6"
          >
            {step === 1 && (
              <>
                <div>
                  <label className="text-sm font-medium text-white/80">
                    Email or Application ID
                  </label>
                  <input
                    type="text"
                    name="emailOrId"
                    value={form.emailOrId}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="john.doe@example.com or CITI-123A"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="********"
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <div>
                <label className="text-sm font-medium text-white/80">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-indigo-500/40 transition-transform duration-300"
            >
              {step === 1 ? "Next" : "Verify OTP"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
