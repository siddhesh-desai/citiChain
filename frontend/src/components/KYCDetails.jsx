import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KYCDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    pan: "",
    aadhaar: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!formData.fullName) err.fullName = "Full name is required";
    if (!formData.dob) err.dob = "Date of birth is required";
    if (!formData.gender) err.gender = "Gender is required";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan))
      err.pan = "Invalid PAN format (e.g., ABCDE1234F)";
    if (!/^\d{12}$/.test(formData.aadhaar))
      err.aadhaar = "Aadhaar must be 12 digits";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("KYC Basic Details:", formData);
      navigate("/kyc/upload"); // Go to next step
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          KYC – Basic Details
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="Your name as on PAN card"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          {errors.dob && (
            <p className="text-red-500 text-sm">{errors.dob}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">PAN Number</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded uppercase"
            placeholder="ABCDE1234F"
            maxLength={10}
          />
          {errors.pan && (
            <p className="text-red-500 text-sm">{errors.pan}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Aadhaar Number</label>
          <input
            type="text"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="12-digit Aadhaar"
            maxLength={12}
          />
          {errors.aadhaar && (
            <p className="text-red-500 text-sm">{errors.aadhaar}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
