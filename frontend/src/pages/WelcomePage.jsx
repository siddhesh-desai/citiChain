import React from "react";
import { useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#040D25] to-[#1E40AF] px-6 relative overflow-hidden text-white font-sans">
      {/* Floating glow backgrounds */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Typewriter Heading */}
      <h1 className="text-center text-white text-[3.5rem] sm:text-[4.2rem] md:text-[5rem] font-extrabold leading-tight tracking-tight mb-6 z-20 drop-shadow-xl">
        Welcome to{" "}
        <span className="text-indigo-300">
          <Typewriter
            words={["CitiChain"]}
            loop={1}
            cursor
            cursorStyle=""
            typeSpeed={100}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </span>
      </h1>

      {/* Glass Card */}
<div
  className="bg-white/10 backdrop-blur-xl border rounded-2xl p-10 text-center shadow-[0_0_12px_2px_rgba(99,102,241,0.6)] max-w-xl w-full z-10"
  style={{
    borderColor: "rgba(99,102,241,0.6)",
  }}
>
        <p className="text-white/70 text-lg md:text-xl mb-10 leading-relaxed">
          Your secure gateway to modern banking and financial services.
        </p>

        {/* User Login / Sign Up */}
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <button
            onClick={() => navigate("/login/user")}
            className="bg-white text-indigo-700 font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-indigo-500/50 transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-indigo-500 to-blue-700 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-blue-600/50 transition duration-300"
          >
            Sign Up
          </button>
        </div>

{/* Admin Access */}
<div className="mb-4 text-sm text-white/60">
  Are you a bank or institution?{" "}
  <button
    onClick={() => navigate("/bank-login")}
    className="underline hover:text-indigo-300 transition"
  >
    Bank Login
  </button>{" "}
  |{" "}
<button
  onClick={() => navigate("/institution/login")}
  className="underline hover:text-indigo-300 transition"
>
  Institution Login
</button>

</div>

        <p className="text-white/50 text-sm mt-6">Trusted by 10M+ users worldwide</p>
      </div>
{/* Passport Status CTA */}
<div className="mt-12 text-center z-20">
  <p className="text-white/60 text-base mb-2">Already applied for OneKYC?</p>
  <button
    onClick={() => navigate("/passport-status-entry")}
    className="border border-indigo-400 text-indigo-100 px-6 py-2 rounded-full bg-white/10 hover:bg-indigo-600/30 backdrop-blur-md transition duration-300 hover:scale-105"
  >
    Check OneKYC Status
  </button>
</div>

      {/* Footer */}
      <div className="absolute bottom-4 text-white/30 text-xs">
        © 2025 CitiChain. All rights reserved.
      </div>
    </div>
  );
};

export default WelcomePage;
