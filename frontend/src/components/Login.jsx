import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import loginIllustration from "../assets/undraw_enter-password_1kl4.svg"; // your image path

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
    <div className="min-h-screen bg-gradient-to-br from-[#040D25] to-[#1E40AF] flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Animated background blobs with subtle white neon outline */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl top-[-10%] left-[-10%]"
        style={{
          background: "radial-gradient(circle at center, #0e1a5c, #040d25)",
          boxShadow: "0 0 20px 2px rgba(255,255,255,0.07)",
        }}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl bottom-[-10%] right-[-10%]"
        style={{
          background: "radial-gradient(circle at center, #123a9c, #0a184a)",
          boxShadow: "0 0 20px 2px rgba(255,255,255,0.07)",
        }}
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      ></motion.div>

      {/* Container with image left (bigger) and login right (static box with subtle neon border) */}
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-center justify-center gap-24 z-10">
        {/* Background Blobs */}
<div className="absolute w-80 h-80 bg-blue-700 rounded-full opacity-20 blur-3xl top-[-10%] left-[-10%] animate-pulse"></div>

        {/* Left: gently floating image */}
<motion.div
  initial={{ opacity: 1, scale: 0.95, y: 0 }}  // start fully visible
  animate={{ scale: 1, y: [-15, 15, -15] }}   // float up/down gently
  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
  className="w-full max-w-[520px]"
>
  <img
    src={loginIllustration}
    alt="Login Illustration"
    className="w-full h-auto select-none"
    draggable={false}
  />
</motion.div>

<div className="absolute w-80 h-80 bg-blue-900 rounded-full opacity-20 blur-3xl bottom-[-10%] right-[-10%] animate-pulse delay-1000"></div>


        {/* Right: Login form container with subtle neon border and no animation */}
        <div
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border rounded-3xl p-12 space-y-8"
          style={{
            borderColor: "rgba(255, 255, 255, 0.12)",
            boxShadow: "0 0 8px 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2 className="text-4xl font-extrabold text-center text-white drop-shadow-lg tracking-wide">
            Login to <span className="text-indigo-400">CitiChain</span>
          </h2>

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
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-indigo-500/40 transition-transform duration-300"
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
        </div>
      </div>
    </div>
  );
}
