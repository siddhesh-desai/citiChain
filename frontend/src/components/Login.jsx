import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.includes("@") || form.password.length < 8) {
      setError("Invalid credentials. Please try again.");
      return;
    }

    setError("");
    alert("Login successful!");
    navigate("/kyc/start");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A23] to-[#1C1C4A] flex items-center justify-center px-6 relative overflow-hidden">

      {/* 💫 Animated Background Blobs */}
      <div className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl top-[-10%] left-[-10%] animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl bottom-[-10%] right-[-10%] animate-pulse delay-1000"></div>

      {/* 🎯 Login Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] p-12 space-y-8 z-10"
      >
        {/* ✨ Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl font-extrabold text-center text-white drop-shadow-lg tracking-wide"
        >
          Login to <span className="text-indigo-400">CitiChain</span>
        </motion.h2>

        {/* 📝 Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
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

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-indigo-500/40 transition-transform duration-300"
          >
            Sign In
          </motion.button>

          <p className="text-center text-sm text-white/60">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-indigo-300 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
