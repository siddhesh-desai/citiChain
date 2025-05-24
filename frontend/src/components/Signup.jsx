import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.email.includes("@") ||
      form.password.length < 8 ||
      form.password !== form.confirmPassword ||
      form.phone.length < 10 ||
      form.otp.length < 4 ||
      !form.acceptedTerms
    ) {
      setError("Please fill all fields correctly and accept the terms.");
      return;
    }

    setError("");
    alert("Signup successful!");
    navigate("/login"); // ✅ redirect to login page after signup
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A23] to-[#1C1C4A] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* 🌈 Background Blobs */}
      <div className="absolute w-80 h-80 bg-indigo-500 rounded-full opacity-20 blur-3xl top-[-10%] left-[-10%] animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl bottom-[-10%] right-[-10%] animate-pulse delay-1000"></div>

      {/* 🧠 Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center mb-8"
      >
        Create your <span className="text-indigo-400">CitiChain</span> account
      </motion.h1>

      {/* 🔒 Signup Form Box */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-10 space-y-6 z-10"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-white/80">Full Name</label>
            <input
              type="text"
              name="name"
              className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80">Email address</label>
              <input
                type="email"
                name="email"
                className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white/80">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80">OTP</label>
              <input
                type="text"
                name="otp"
                className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="1234"
                value={form.otp}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/40 transition-transform duration-300"
                onClick={() => alert("OTP sent to phone")}
              >
                Send OTP
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80">Password</label>
              <input
                type="password"
                name="password"
                className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/80">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="********"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ✅ Accept Terms Checkbox */}
          <div className="flex items-center gap-2 text-white/80">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
              className="accent-indigo-500 w-4 h-4"
            />
            <label className="text-sm">I accept the Terms & Conditions</label>
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-indigo-500/40 transition-transform duration-300"
          >
            Sign Up
          </motion.button>

          <p className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-300 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
