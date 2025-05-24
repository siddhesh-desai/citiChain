import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KYCAddress() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    proofType: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!formData.addressLine1) err.addressLine1 = "Address Line 1 is required";
    if (!formData.city) err.city = "City is required";
    if (!formData.state) err.state = "State is required";
    if (!/^\d{6}$/.test(formData.pincode)) err.pincode = "Enter valid 6-digit PIN code";
    if (!formData.proofType) err.proofType = "Select an address proof type";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Address Details:", formData);
      navigate("/kyc/photo"); // Proceed to selfie
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">KYC – Address Proof</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Address Line 1</label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="Flat / House No. / Street"
          />
          {errors.addressLine1 && (
            <p className="text-red-500 text-sm">{errors.addressLine1}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Address Line 2</label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            placeholder="Landmark / Area (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">PIN Code</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              maxLength={6}
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Address Proof Type</label>
          <select
            name="proofType"
            value={formData.proofType}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Proof</option>
            <option value="Aadhaar">Aadhaar Card</option>
            <option value="Voter ID">Voter ID</option>
            <option value="Driving License">Driving License</option>
            <option value="Passport">Passport</option>
            <option value="Utility Bill">Utility Bill</option>
          </select>
          {errors.proofType && (
            <p className="text-red-500 text-sm">{errors.proofType}</p>
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
