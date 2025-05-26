import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const TransferMoneyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState("choose");
  const [upiId, setUpiId] = useState(location.state?.to || "");
  const [amount, setAmount] = useState(location.state?.amount || "");
  const [note, setNote] = useState(location.state?.note || "");
  const [pin, setPin] = useState("");
  const [loanUpdate, setLoanUpdate] = useState(location.state?.loanUpdate || null);
  const html5QrCodeRef = useRef(null);
  const isScannerRunningRef = useRef(false);
  const fileInputRef = useRef(null);

  const isValidUpiId = (id) => /^[\w.\-_]{2,}@[a-zA-Z]{2,}$/.test(id);

  const startScanner = () => {
    try {
      setStep("scan");
    } catch {
      setStep("choose");
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current && isScannerRunningRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          isScannerRunningRef.current = false;
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (step === "scan") {
      try {
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCodeRef.current = html5QrCode;
        html5QrCode
          .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
              if (decodedText.startsWith("upi://pay?")) {
                const match = decodedText.match(/pa=([^&]*)/);
                if (match) {
                  setUpiId(match[1]);
                  stopScanner();
                  setStep("fill");
                }
              }
            },
            (error) => {}
          )
          .then(() => {
            isScannerRunningRef.current = true;
          })
          .catch(() => setStep("choose"));
        return () => stopScanner();
      } catch {
        setStep("choose");
      }
    }
  }, [step]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const html5QrCode = html5QrCodeRef.current || new Html5Qrcode("qr-file-reader");
      if (!html5QrCodeRef.current) html5QrCodeRef.current = html5QrCode;
      const result = await html5QrCode.scanFile(file, true);
      if (result.startsWith("upi://pay?")) {
        const match = result.match(/pa=([^&]*)/);
        if (match) {
          setUpiId(match[1]);
          setStep("fill");
        }
      } else {
        alert("Invalid UPI QR Code.");
      }
    } catch {
      alert("QR scan failed. Try a different image.");
    }
  };

  const handleSendMoney = () => {
    if (pin !== "1234") {
      alert("Invalid PIN!");
      return;
    }
    setStep("success");
    setTimeout(() => {
      navigate("/smart-loan", {
        state: loanUpdate ? { loanUpdate } : undefined,
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#012B52] to-[#0A0F3A] text-white flex flex-col items-center justify-center px-6 py-10 font-sans">
      {step === "choose" && (
        <div className="max-w-xl w-full bg-white/10 backdrop-blur-lg p-10 rounded-xl border border-blue-400/20 shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-8">Choose Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={startScanner}
              className="py-3 bg-[#1e40af] rounded-xl font-semibold hover:bg-[#1e3a8a] transition"
            >
              Scan QR with Camera
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3 bg-[#1e40af] rounded-xl font-semibold hover:bg-[#1e3a8a] transition"
            >
              Upload QR Image
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          <div className="mt-6">
            <label className="block mb-2 text-white/80 text-lg">Enter UPI ID manually:</label>
            <input
              type="text"
              placeholder="example@bank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-3 rounded-xl text-black text-lg border border-blue-300"
            />
            <button
              disabled={!upiId || !isValidUpiId(upiId)}
              onClick={() => setStep("fill")}
              className="mt-4 w-full py-3 bg-[#1e40af] rounded-xl text-lg font-bold hover:bg-[#1e3a8a] transition disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "scan" && (
        <div className="max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Scan QR Code</h2>
          <div
            id="qr-reader"
            className="w-full rounded-xl overflow-hidden shadow-xl border border-white/20 mb-4"
            style={{ aspectRatio: "1 / 1" }}
          />
          <div className="flex gap-4">
            <button
              onClick={() => {
                stopScanner();
                setStep("choose");
              }}
              className="w-1/2 py-2 bg-gray-600 hover:bg-gray-700 rounded transition"
            >
              Back
            </button>
            <button
              onClick={() => {
                stopScanner();
                navigate("/smart-loan");
              }}
              className="w-1/2 py-2 bg-red-600 hover:bg-red-700 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "fill" && (
        <div className="max-w-xl w-full bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-indigo-400/10 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">
            Send to: <span className="text-indigo-300 font-bold">{upiId}</span>
          </h2>
          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/70 text-lg border border-blue-300"
          />
          <input
            type="password"
            placeholder="Enter UPI PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-xl bg-white/20 text-white placeholder-white/70 text-lg border border-blue-300"
          />
          <button
            disabled={!amount || Number(amount) <= 0 || !pin}
            onClick={handleSendMoney}
            className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold py-3 rounded-xl text-lg transition disabled:opacity-50"
          >
            Pay ₹{amount || "0"}
          </button>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep("choose")}
              className="w-1/2 mr-2 py-2 bg-gray-600 hover:bg-gray-700 rounded-xl transition"
            >
              Back
            </button>
            <button
              onClick={() => {
                setStep("choose");
                setAmount("");
                setUpiId("");
                setPin("");
              }}
              className="w-1/2 ml-2 py-2 bg-red-600 hover:bg-red-700 rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="max-w-md w-full text-center p-6 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg animate-fade-in border border-green-300/20">
          <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold text-green-400 mb-2">Payment Successful</h2>
          <p className="text-white/80 mb-2">
            ₹{amount} sent to <span className="text-indigo-300">{upiId}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TransferMoneyPage;
