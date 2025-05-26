import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/etienne-martin-2_K82gx9Uk8-unsplash.jpg";

const BankLoginPage = () => {
  const [bankId, setBankId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bankId === "admin" && password === "admin123") {
      navigate("/bank/dashboard");
    } else {
      alert("Invalid credentials. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-8 shadow-2xl w-full max-w-md text-gray-900">
        <h2 className="text-3xl font-bold mb-6 text-center">CitiChain Bank Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Bank ID</label>
            <input
              type="text"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Bank ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter Password"
              required
            />
            <div className="text-sm mt-1">
              <label className="flex items-center text-gray-700">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                Show Password
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white transition py-2 rounded font-semibold text-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default BankLoginPage;

//id= admin
//pw- admin123