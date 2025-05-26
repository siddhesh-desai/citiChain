import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginIllustration from "../assets/undraw_website_zbig.svg";

const categories = [
  "--",
  "Agriculture",
  "Automotive",
  "Banking & Finance",
  "Construction & Infrastructure",
  "Education",
  "Energy & Utilities",
  "Healthcare",
  "Hospitality & Tourism",
  "Information Technology & Software",
  "Manufacturing",
  "Media & Entertainment",
  "NGOs",
  "Retail & E-commerce",
  "Telecommunications",
  "Transportation & Logistics",
  "Others",
];

function OTPModal({ visible, onClose, onVerify }) {
  const [otp, setOtp] = useState("");

  if (!visible) return null;

  const handleVerify = () => {
    if (otp.trim().length === 0) {
      alert("Please enter OTP");
      return;
    }
    onVerify(otp);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-full mx-4 animate-fadeIn">
        <h3 className="text-xl font-semibold mb-4 text-center">Enter OTP</h3>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="6-digit OTP"
          inputMode="numeric"
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InstitutionLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);

  // Login states
  const [institutionId, setInstitutionId] = useState("");
  const [password, setPassword] = useState("");

  // Signup states
  const [businessName, setBusinessName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [instituteIdSignup, setInstituteIdSignup] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [registrationCert, setRegistrationCert] = useState(null);
  const [certified, setCertified] = useState(false);
  const [signupOtpModal, setSignupOtpModal] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedInstitution");
    if (remembered) {
      navigate("/institution/dashboard");
    }
  }, []);

  // Handle Signup OTP verification
  const handleSignupOtpVerify = (otp) => {
    const users = JSON.parse(localStorage.getItem("institutions")) || [];
    users.push({
      institutionId: instituteIdSignup,
      password: signupPassword,
      category,
      bankAccount,
      businessName,
    });
    localStorage.setItem("institutions", JSON.stringify(users));

    if (rememberMe) {
      localStorage.setItem("rememberedInstitution", instituteIdSignup);
    }

    setSignupOtpModal(false);
    alert("Signup successful!");
    navigate("/institution/dashboard");
  };

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!institutionId || !password || !category) {
      alert("Please fill all login fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("institutions")) || [];
    const match = users.find(
      (u) =>
        u.institutionId === institutionId &&
        u.password === password &&
        u.category === category
    );

    if (match) {
      if (rememberMe) {
        localStorage.setItem("rememberedInstitution", institutionId);
      } else {
        localStorage.removeItem("rememberedInstitution");
      }

      alert("Login successful");
      navigate("/institution/dashboard");
    } else {
      alert("Invalid credentials. Please check your Institution ID, Password, and Category.");
    }
  };

  // Handle Signup
  const handleSignup = (e) => {
    e.preventDefault();

    if (!certified) {
      alert("Please certify your institution registration.");
      return;
    }

    if (
      !businessName ||
      !signupPassword ||
      !instituteIdSignup ||
      !bankAccount ||
      !registrationCert ||
      !category
    ) {
      alert("Please fill all signup fields.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("institutions")) || [];
    const exists = users.some((u) => u.institutionId === instituteIdSignup);

    if (exists) {
      alert("Institution ID already registered.");
      return;
    }

    setSignupOtpModal(true);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative overflow-hidden bg-gradient-to-br from-[#040D25] to-[#1E40AF]">
      {/* Background Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-400 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Left Side Image */}
      <div className="hidden md:flex items-center justify-center px-6">
        <img
          src={loginIllustration}
          alt="Institution login"
          className="max-h-[80vh] max-w-[90%] object-contain animate-float relative z-10"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex items-center justify-center px-6 relative z-20">
        <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-indigo-400/50 rounded-2xl shadow-[0_0_15px_3px_rgba(99,102,241,0.6)] max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-full font-semibold transition-transform duration-300 ${
                isLogin ? "bg-blue-500 text-white scale-105" : "bg-gray-200 text-gray-800 hover:scale-105"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-full font-semibold transition-transform duration-300 ${
                !isLogin ? "bg-blue-500 text-white scale-105" : "bg-gray-200 text-gray-800 hover:scale-105"
              }`}
            >
              Signup
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin}>
              <h2 className="text-3xl font-bold text-center mb-6 text-white">Institution Login</h2>

              <label className="block mb-2 font-medium text-white">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/20 text-white focus:outline-none"
                required
              >
                <option value="" disabled>-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-black">{cat}</option>
                ))}
              </select>

              <label className="block mb-1 text-white">Institution ID</label>
              <input
                type="text"
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/20 text-white"
                required
              />

              <label className="block mb-1 text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/20 text-white"
                required
              />

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="rememberMe" className="text-white/80">
                  Remember Me
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <h2 className="text-3xl font-bold text-center mb-6 text-blue-300">Institution Signup</h2>

              <label className="block mb-1 text-white/80">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/20 text-white"
                required
              />

              <label className="block mb-1 text-white/80">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/20 text-white"
                required
              >
                <option value="" disabled>-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="text-black">{cat}</option>
                ))}
              </select>

              <label className="block mb-1 text-blue-300">Institute ID</label>
              <input
                type="text"
                value={instituteIdSignup}
                onChange={(e) => setInstituteIdSignup(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/20 text-white"
                required
              />

              <label className="block mb-1 text-blue-300">Password</label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/20 text-white"
                required
              />

              <label className="block mb-1 text-blue-300">Bank Account Number</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/20 text-white"
                required
              />

              <label className="block mb-1 text-blue-300">Upload Registration Certificate</label>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => setRegistrationCert(e.target.files[0])}
                className="w-full mb-4 px-4 py-2 rounded border border-white/30 bg-white/20 text-white"
                required
              />

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  checked={certified}
                  onChange={() => setCertified(!certified)}
                  id="certify"
                  className="mr-2"
                />
                <label htmlFor="certify" className="text-white/90 cursor-pointer">
                  I certify that the registration certificate is authentic.
                </label>
              </div>

              <button
                type="submit"
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition duration-300 ${
                  !certified ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!certified}
              >
                Signup
              </button>
            </form>
          )}
        </div>
      </div>

      {/* OTP Modal for signup only */}
      <OTPModal
        visible={signupOtpModal}
        onClose={() => setSignupOtpModal(false)}
        onVerify={handleSignupOtpVerify}
      />
    </div>
  );
}
