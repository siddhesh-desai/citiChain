import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BLUE_START = "#1e40af"; // primary blue start
const BLUE_END = "#2563eb";   // primary blue end

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
    livePhotoURL: "",
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

    // Call api http://localhost:8000/kyc/register and pass user data

    // Format the user data to match the expected structure below and if not present give default 123
    //     {
    //   "name": "John Doe",
    //   "email": "sW123",
    //   "password": "password123",
    //   "mobile": "123456789013",
    //   "dob": "1990-01-01",
    //   "address": "123 Main St, City, Country",
    //   "document_links": {
    //     "pan": "https://example.com/pan.jpg",
    //     "aadhar": "https://example.com/aadhar.jpg"
    //   },
    //   "pan_number": "ABCDE1234F13",
    //   "aadhar_number": "1234-5678-901213"
    // }

    // Assuming formData contains the necessary fields
    // Let the form data be fetched from user in local storage



    const userData = {
      name: formData.fullName || "John Doe",
      email: formData.email || "sW123",
      password: "password123", // Default password, should be handled securely in production
      mobile: formData.phone.replace(/[^0-9]/g, "") || "123456789013", // Clean phone number
      dob: formData.dob || "1990-01-01",
      address: `${formData.addressLine1}, ${formData.addressLine2 || ""}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`,
      document_links: {
        pan: formData.pan || "ABCDE1234F13",
        aadhar: formData.aadhaar || "1234-5678-901213",
      },
      pan_number: formData.pan || "ABCDE1234F13",
      aadhar_number: formData.aadhaar || "1234-5678-901213",
    };


    fetch("http://localhost:8000/kyc/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        declarationAccepted: declarationAgreed,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("KYC registration successful:", data);
        // Store user data in local storage
        localStorage.setItem("user", JSON.stringify(data)); // Assuming 'data' is the userData
        // Navigate to KYC status page
        navigate("/kyc/status");
      })
      .catch((error) => {
        console.error("There was a problem with the KYC registration:", error);
      });
    }

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
          background:
            "linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%)", // subtle light gradient background
          color: "#1e40af",
          padding: "48px 16px",
          fontFamily:
            "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            width: "100%",
            margin: "auto",
            backgroundColor: "white",
            borderRadius: 16,
            padding: 40,
            boxShadow: "0 12px 24px rgba(30, 64, 175, 0.15)",
            color: "#111827",
            userSelect: "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1
            style={{
              fontSize: "2.75rem",
              fontWeight: 700,
              marginBottom: 24,
              borderBottom: `4px solid ${BLUE_START}`,
              paddingBottom: 10,
              color: BLUE_START,
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
                marginLeft: 24,
                fontSize: 16,
                color: BLUE_START,
                fontWeight: 600,
                fontFamily:
                  "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
                  border: `3px solid ${BLUE_START}`,
                  boxShadow: `0 0 14px ${BLUE_START}`,
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

          {/* Declaration checkbox */}
          <section
            style={{
              marginTop: 36,
              borderTop: `2px solid ${BLUE_START}`,
              paddingTop: 20,
              color: "#4B5563",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                userSelect: "none",
                fontSize: 15,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              <input
                type="checkbox"
                checked={declarationAgreed}
                onChange={() => setDeclarationAgreed(!declarationAgreed)}
                style={{
                  width: 22,
                  height: 22,
                  accentColor: BLUE_START,
                  cursor: "pointer",
                  borderRadius: 4,
                }}
              />
              I hereby declare that all the information provided above is true,
              accurate, and complete to the best of my knowledge.
            </label>
          </section>

          {/* OTP section */}
          {declarationAgreed && (
            <section
              style={{
                marginTop: 28,
                paddingTop: 20,
                borderTop: `1px solid #d1d5db`,
              }}
            >
              <label
                htmlFor="otp-input"
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: 10,
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
                  padding: "14px 16px",
                  fontSize: 18,
                  borderRadius: 8,
                  border: error ? "2px solid #dc2626" : `1.5px solid ${BLUE_START}`,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s ease",
                  fontWeight: 600,
                  color: "#111827",
                }}
              />
              {error && (
                <p
                  style={{
                    color: "#dc2626",
                    marginTop: 6,
                    fontWeight: 700,
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
                  marginTop: 14,
                  background: "none",
                  border: "none",
                  color: BLUE_START,
                  fontWeight: "700",
                  cursor: "pointer",
                  textDecoration: "underline",
                  userSelect: "none",
                  fontSize: 15,
                  padding: 0,
                  letterSpacing: 0.4,
                }}
              >
                Resend OTP
              </button>

              {resendMessage && (
                <p
                  style={{
                    marginTop: 8,
                    color: BLUE_END,
                    fontWeight: 700,
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
              marginTop: 36,
              width: "100%",
              padding: "16px 0",
              backgroundColor:
                declarationAgreed && otp.length === 6 ? BLUE_START : "#a5b4fc",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 18,
              cursor:
                declarationAgreed && otp.length === 6 ? "pointer" : "not-allowed",
              transition: "background-color 0.3s ease",
              userSelect: "none",
              boxShadow:
                declarationAgreed && otp.length === 6
                  ? `0 8px 20px ${BLUE_START}aa`
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (declarationAgreed && otp.length === 6)
                e.currentTarget.style.backgroundColor = "#1c3a8a";
            }}
            onMouseLeave={(e) => {
              if (declarationAgreed && otp.length === 6)
                e.currentTarget.style.backgroundColor = BLUE_START;
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
      <section style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            borderBottom: `2px solid ${BLUE_START}`,
            paddingBottom: 6,
            marginBottom: 16,
            color: BLUE_START,
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
          marginBottom: 12,
          fontSize: 16,
          display: "flex",
          justifyContent: "space-between",
          userSelect: "none",
          gap: 10,
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
