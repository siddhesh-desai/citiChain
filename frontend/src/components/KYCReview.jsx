import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BLUE_START = "#1e40af";  // changed to blue gradient start
const BLUE_END = "#2563eb";    // changed to blue gradient end

export default function KYCReview({ kycData }) {
  const navigate = useNavigate();
  const defaultData = {
    fullName: "Rudrika Sharma",
    dob: "1998-04-15",
    gender: "Female",
    aadhaar: "1234-5678-9012",
    pan: "ABCDE1234F",
    phone: "+91-9876543210",
    email: "rudrika@example.com",
    addressLine1: "12 MG Road",
    addressLine2: "Near Brigade Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    country: "India",
    occupation: "Software Developer",
    incomeRange: "₹5,00,000 - ₹10,00,000",
    maritalStatus: "Single",
    nationality: "Indian",
    fatherName: "Rajesh Sharma",
    motherName: "Sunita Sharma",
    documentsUploaded: ["Aadhaar Card (Front & Back)", "PAN Card", "Passport (Optional)"],
    livePhotoStatus: "Live selfie captured",
    livePhotoURL: "", // Insert base64 or URL here
    declarationAccepted: true,
  };

  const [formData, setFormData] = useState(kycData || defaultData);
  const [declarationAgreed, setDeclarationAgreed] = useState(
    kycData?.declarationAccepted ?? defaultData.declarationAccepted
  );

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (kycData) setFormData(kycData);
  }, [kycData]);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = () => {
    if (!declarationAgreed) {
      alert("Please accept the declaration before submitting.");
      return;
    }
    if (otp !== "123456") {
      setError("Invalid OTP. Please enter the correct 6-digit code.");
      return;
    }
    alert("KYC submitted for verification successfully!");
    navigate("/dashboard");
  };

  const handleOtpChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 6) {
      setOtp(val);
      setError("");
    }
  };

  const resendOtp = () => {
    setResendMessage("OTP has been resent to your registered mobile number.");
    setTimeout(() => setResendMessage(""), 5000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${BLUE_START} 0%, ${BLUE_END} 100%)`,
        color: "#f9fafb",
        padding: "40px 20px",
        fontFamily:
          "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "auto",
          backgroundColor: "white",
          borderRadius: 14,
          padding: 40,
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
          animation: "fadeInUp 0.7s ease forwards",
          color: "#111827",
        }}
      >
        <h1
          style={{
            fontSize: "2.75rem",
            fontWeight: 700,
            marginBottom: 20,
            borderBottom: `4px solid ${BLUE_END}`,
            paddingBottom: 10,
            color: BLUE_END,
            userSelect: "none",
          }}
        >
          KYC Review Summary
        </h1>

        <Section title="Personal Information">
          <Field label="Full Name" value={formData.fullName} />
          <Field label="Date of Birth" value={formatDate(formData.dob)} />
          <Field label="Gender" value={formData.gender} />
          <Field label="Marital Status" value={formData.maritalStatus} />
          <Field label="Nationality" value={formData.nationality} />
          <Field label="Father's Name" value={formData.fatherName} />
          <Field label="Mother's Name" value={formData.motherName} />
        </Section>

        <Section title="Identity & Contact Details">
          <Field label="Aadhaar Number" value={formData.aadhaar} />
          <Field label="PAN Number" value={formData.pan} />
          <Field label="Mobile Number" value={formData.phone} />
          <Field label="Email Address" value={formData.email} />
        </Section>

        <Section title="Residential Address">
          <Field label="Address Line 1" value={formData.addressLine1} />
          <Field label="Address Line 2" value={formData.addressLine2} />
          <Field label="City" value={formData.city} />
          <Field label="State" value={formData.state} />
          <Field label="PIN Code" value={formData.pincode} />
          <Field label="Country" value={formData.country} />
        </Section>

        <Section title="Employment & Income">
          <Field label="Occupation" value={formData.occupation} />
          <Field label="Income Range" value={formData.incomeRange} />
        </Section>

        <Section title="Uploaded Documents">
          <ul
            style={{
              listStyleType: "disc",
              marginLeft: 20,
              color: "#374151",
              fontSize: 16,
            }}
          >
            {formData.documentsUploaded.map((doc, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {doc}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Live Photo">
          {formData.livePhotoURL ? (
            <img
              src={formData.livePhotoURL}
              alt="Live Selfie"
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                objectFit: "cover",
                border: `4px solid ${BLUE_END}`,
                boxShadow: `0 0 15px ${BLUE_END}`,
              }}
            />
          ) : (
            <p
              style={{
                fontStyle: "italic",
                color: "#6B7280",
                fontSize: 16,
              }}
            >
              {formData.livePhotoStatus}
            </p>
          )}
        </Section>

        {/* Declaration checkbox section - unchanged */}
        <section
          style={{
            marginTop: 32,
            borderTop: `2px solid ${BLUE_END}`,
            paddingTop: 20,
            color: "#374151",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              userSelect: "none",
              fontSize: 15,
            }}
          >
            <input
              type="checkbox"
              checked={declarationAgreed}
              onChange={() => setDeclarationAgreed(!declarationAgreed)}
              style={{
                width: 22,
                height: 22,
                accentColor: BLUE_END,
                cursor: "pointer",
              }}
            />
            I hereby declare that all the information provided above is true,
            accurate, and complete to the best of my knowledge.
          </label>
        </section>

        {/* OTP section - ONLY show if declaration checkbox is checked */}
        {declarationAgreed && (
          <section
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: `1px solid #d1d5db`,
            }}
          >
            <label
              htmlFor="otp-input"
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: 8,
                color: "#374151",
                userSelect: "none",
                fontSize: 16,
              }}
            >
              Enter the 6-digit OTP sent to your registered mobile:{" "}
              <strong>{formData.phone}</strong>
            </label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              maxLength={6}
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: 18,
                borderRadius: 8,
                border: error ? "2px solid #dc2626" : "1px solid #9ca3af",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <p
                style={{
                  color: "#dc2626",
                  marginTop: 6,
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                {error}
              </p>
            )}

            <button
              onClick={resendOtp}
              type="button"
              style={{
                marginTop: 12,
                background: "none",
                border: "none",
                color: BLUE_END,
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
                userSelect: "none",
                fontSize: 15,
                padding: 0,
              }}
            >
              Resend OTP
            </button>

            {resendMessage && (
              <p
                style={{
                  marginTop: 8,
                  color: "#2563eb",
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                {resendMessage}
              </p>
            )}
          </section>
        )}

        <button
          onClick={handleSubmit}
          disabled={!declarationAgreed || otp.length !== 6}
          style={{
            marginTop: 30,
            width: "100%",
            padding: "16px 0",
            backgroundColor:
              declarationAgreed && otp.length === 6 ? BLUE_END : "#93c5fd",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 18,
            cursor:
              declarationAgreed && otp.length === 6 ? "pointer" : "not-allowed",
            transition: "background-color 0.3s ease",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            if (declarationAgreed && otp.length === 6)
              e.currentTarget.style.backgroundColor = "#1e3a8a";
          }}
          onMouseLeave={(e) => {
            if (declarationAgreed && otp.length === 6)
              e.currentTarget.style.backgroundColor = BLUE_END;
          }}
        >
          Submit KYC
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2
        style={{
          fontSize: "1.6rem",
          fontWeight: 700,
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: 6,
          marginBottom: 12,
          color: "#1e3a8a",
          userSelect: "none",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div
      style={{
        marginBottom: 10,
        fontSize: 16,
        display: "flex",
        justifyContent: "space-between",
        userSelect: "none",
      }}
    >
      <span
        style={{
          fontWeight: 600,
          color: "#374151",
          maxWidth: "40%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
      <span
        style={{
          maxWidth: "58%",
          textAlign: "right",
          color: "#111827",
          fontWeight: 500,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </span>
    </div>
  );
}
