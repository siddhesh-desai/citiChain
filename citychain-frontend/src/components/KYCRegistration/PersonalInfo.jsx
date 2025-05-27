import React, { useState } from "react";
import { UserIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const PersonalInfo = ({ formData, setFormData, nextStep }) => {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    if (!formData.fullname?.trim())
      newErrors.fullname = "Full name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.phone_number?.trim())
      newErrors.phone_number = "Phone number is required";
    if (!formData.user_dob) newErrors.user_dob = "Date of birth is required";
    if (!formData.password?.trim()) newErrors.password = "Password is required";

    // Age validation (must be 18+)
    if (formData.user_dob) {
      const age = calculateAge(formData.user_dob);
      if (age < 18) newErrors.user_dob = "You must be 18 years or older";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <UserIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          Personal Information
        </h2>
        <p className="text-gray-600">Step 1 of 4</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullname || ""}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
            className={`w-full p-3 border rounded-lg ${errors.fullname ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your full name"
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`w-full p-3 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <input
            type="text"
            value={formData.username || ""}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className={`w-full p-3 border rounded-lg ${errors.username ? "border-red-500" : "border-gray-300"}`}
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone_number || ""}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
            className={`w-full p-3 border rounded-lg ${errors.phone_number ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter your phone number"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.user_dob || ""}
            onChange={(e) =>
              setFormData({ ...formData, user_dob: e.target.value })
            }
            className={`w-full p-3 border rounded-lg ${errors.user_dob ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.user_dob && (
            <p className="text-red-500 text-sm mt-1">{errors.user_dob}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            value={formData.password || ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`w-full p-3 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"}`}
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
