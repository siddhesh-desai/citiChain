import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";  // <-- import this

const TransferMoneyPage = () => {
  const navigate = useNavigate();  // <-- initialize navigate
  const [step, setStep] = useState("choose");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const html5QrCodeRef = useRef(null);
  const isScannerRunningRef = useRef(false);
  const fileInputRef = useRef(null);

  const isValidUpiId = (id) => /^[\w.\-_]{2,}@[a-zA-Z]{2,}$/.test(id);

  const startScanner = () => {
    setStep("scan");
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
        .catch(() => {
          setStep("choose");
        });

      return () => {
        stopScanner();
      };
    }
  }, [step]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const html5QrCode = html5QrCodeRef.current || new Html5Qrcode("qr-reader");
      if (!html5QrCodeRef.current) html5QrCodeRef.current = html5QrCode;

      const result = await html5QrCode.scanFile(file, true);
      if (result.startsWith("upi://pay?")) {
        const match = result.match(/pa=([^&]*)/);
        if (match) {
          setUpiId(match[1]);
          setStep("fill");
        }
      } else {
        alert("Uploaded QR code is not a valid UPI QR.");
      }
    } catch (err) {
      alert("Failed to scan uploaded QR code. Please try again.");
    }
  };

  const handleSendMoney = () => {
    alert(`Sending ₹${amount} to ${upiId}`);
    setStep("success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A23] to-[#1B235F] text-white flex flex-col items-center justify-center px-6 py-10 font-sans">
      {step === "choose" && (
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-6">Choose Payment Option</h2>
          <button
            onClick={startScanner}
            className="mb-4 w-full py-3 bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Scan QR with Camera
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mb-4 w-full py-3 bg-indigo-600 rounded hover:bg-indigo-700 transition"
          >
            Upload QR Code Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          <div className="mt-4">
            <label htmlFor="manualUpi" className="block mb-2">
              Or enter UPI ID manually:
            </label>
            <input
              id="manualUpi"
              type="text"
              placeholder="example@bank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            <button
              disabled={!upiId || !isValidUpiId(upiId)}
              onClick={() => setStep("fill")}
              className="mt-3 w-full py-2 bg-indigo-600 rounded disabled:opacity-50 hover:bg-indigo-700 transition"
            >
              Continue
            </button>
            {upiId && !isValidUpiId(upiId) && (
              <p className="text-red-400 text-sm mt-1">Enter a valid UPI ID format</p>
            )}
          </div>
        </div>
      )}

      {step === "scan" && (
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-4 text-center">Scan QR Code</h2>
          <div
            id="qr-reader"
            className="w-full rounded-xl overflow-hidden shadow-xl border border-white/20 mb-4"
            style={{ aspectRatio: "1 / 1" }}
          />
          <button
            onClick={() => {
              stopScanner();
              setStep("choose");
            }}
            className="w-full py-2 bg-red-600 rounded hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {step === "fill" && (
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-xl text-white">
          <h2 className="text-2xl font-semibold mb-4">
            Send to: <span className="text-indigo-300">{upiId}</span>
          </h2>
          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
          />
          <button
            disabled={!amount || Number(amount) <= 0}
            onClick={handleSendMoney}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
          >
            Send ₹{amount || "0"}
          </button>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setStep("choose")}
              className="w-1/2 mr-2 py-2 bg-gray-600 hover:bg-gray-700 rounded transition"
            >
              Back
            </button>
            <button
              onClick={() => {
                setStep("choose");
                setAmount("");
                setUpiId("");
              }}
              className="w-1/2 ml-2 py-2 bg-red-600 hover:bg-red-700 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="max-w-md w-full text-center p-6 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-green-400 mb-2">✅ Payment Successful</h2>
          <p className="text-white/80 mb-2">
            ₹{amount} sent to <span className="text-indigo-300">{upiId}</span>
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setStep("choose");
                setAmount("");
                setUpiId("");
              }}
              className="mt-6 py-2 px-4 bg-indigo-600 rounded hover:bg-indigo-700 transition"
            >
              Make another transfer
            </button>
            <button
              onClick={() => {
                // Navigate to dashboard route
                navigate("/dashboard");
              }}
              className="mt-6 py-2 px-4 bg-gray-600 rounded hover:bg-gray-700 transition"
            >
              End
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferMoneyPage;
