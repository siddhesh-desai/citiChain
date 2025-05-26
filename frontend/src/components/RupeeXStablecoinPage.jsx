import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import TransferImage from "../assets/undraw_transfer-money_h9s3 (1).svg";
import {
  BanknotesIcon,
  DocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  CurrencyRupeeIcon,
  Bars3Icon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const MID_ROYAL_BLUE = "#012B52";

const menuLinks = [
  { icon: BanknotesIcon, label: "Dashboard", path: "/dashboard" },
  { icon: DocumentCheckIcon, label: "KYC", path: "/kyc/start" },
  { icon: DocumentDuplicateIcon, label: "Statements", path: "/rupeex/history" },
  { icon: ShieldCheckIcon, label: "Passport", path: "/passport" },
  { icon: BuildingLibraryIcon, label: "Loan", path: "/smart-loan" },
  { icon: CurrencyRupeeIcon, label: "RupeeX", path: "/rupeex", active: true },
];

export default function RupeeXTransactionPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(234000.0);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState("form");

  const html5QrCodeRef = useRef(null);
  const isScannerRunningRef = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (step === "scan") {
      const qr = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = qr;

      qr
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            if (decodedText.startsWith("upi://pay?")) {
              const match = decodedText.match(/pa=([^&]*)/);
              if (match) {
                setReceiver(match[1]);
                toast.success("✅ QR code scanned!");
                stopScanner();
                setStep("form");
              }
            } else {
              toast.error("Invalid QR code scanned.");
            }
          },
          (err) => {}
        )
        .then(() => {
          isScannerRunningRef.current = true;
        })
        .catch(() => {
          setStep("form");
        });

      return () => stopScanner();
    }
  }, [step]);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const qr = html5QrCodeRef.current || new Html5Qrcode("qr-reader");
    html5QrCodeRef.current = qr;

    try {
      const result = await qr.scanFile(file, true);
      if (result.startsWith("upi://pay?")) {
        const match = result.match(/pa=([^&]*)/);
        if (match) {
          setReceiver(match[1]);
          toast.success("✅ QR code image scanned!");
          setStep("form");
        } else {
          toast.error("UPI ID not found in QR code.");
        }
      } else {
        toast.error("Invalid QR code.");
      }
    } catch (err) {
      toast.error("Failed to scan image.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    const correctPin = localStorage.getItem("rupeex-pin") || "1234";

    if (isNaN(amt) || amt <= 0 || pin.length !== 4 || pin !== correctPin || !receiver) {
      toast.error("⚠️ Invalid input or PIN.");
      return;
    }

    if (amt > balance) {
      toast.error("Insufficient balance.");
      return;
    }

    const newBalance = balance - amt;
    setBalance(newBalance);
    toast.success(`Sent ₹${amt.toFixed(2)}`);

    const history = JSON.parse(localStorage.getItem("rupeex-history") || "[]");
    history.unshift({
      id: Date.now(),
      type: "redeem",
      receiver,
      amount: amt,
      date: new Date().toLocaleString(),
    });
    localStorage.setItem("rupeex-history", JSON.stringify(history));

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);

    setAmount("");
    setPin("");
    setReceiver("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f4faff] to-[#e6eeff] font-[Inter]">
      <aside className="transition-all duration-300 w-20 bg-[#012B52] text-white p-6 shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold tracking-wide hidden">CitiChain</h2>
          <button className="text-white">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
        <nav className="space-y-4">
          {menuLinks.map(({ icon: Icon, label, path, active }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left ${
                active ? "bg-white/10 text-indigo-200" : "hover:bg-white/10"
              } transition-all`}
            >
              <Icon className="w-6 h-6 shrink-0" />
            </button>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="mt-6 flex items-center gap-3 px-4 py-2 hover:bg-red-600/10 text-red-300 rounded-xl"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </nav>
      </aside>

      <Toaster />

      <div className="flex flex-1 flex-col md:flex-row items-center justify-center p-6 gap-12">
        <div className="hidden md:flex w-1/2 justify-center">
          <img src={TransferImage} alt="Transfer" className="max-w-sm" />
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-indigo-200 p-8 space-y-6">
          {!showSuccess ? (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-indigo-700">RupeeX Transaction</h1>
                <p className="text-gray-500 text-sm">Scan or Enter UPI to send ₹X</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500">Balance</p>
                <h2 className="text-4xl font-extrabold text-indigo-800">
                  ₹{balance.toFixed(2)}
                </h2>
              </div>

              {step === "scan" && <div id="qr-reader" className="rounded-lg" />}

              {step === "form" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Receiver UPI ID</label>
                    <input
                      type="text"
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                      placeholder="e.g. rudrika@citichain"
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <div className="text-xs text-indigo-500 mt-1 flex gap-3">
                      <span className="cursor-pointer underline" onClick={() => setStep("scan")}>
                        Scan QR
                      </span>
                      <span className="cursor-pointer underline" onClick={() => fileInputRef.current?.click()}>
                        Upload QR Image
                      </span>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">4-digit PIN</label>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={4}
                      inputMode="numeric"
                      className="w-full tracking-widest text-center text-2xl font-bold px-6 py-3 rounded-xl border border-indigo-400 focus:ring-4 focus:ring-indigo-500 shadow-inner bg-gradient-to-r from-white to-indigo-50 outline-none"
                      required
                      style={{ letterSpacing: "0.75em", fontSize: "2rem", WebkitTextSecurity: "disc" }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-semibold text-lg transition"
                  >
                    Send ₹{amount || "X"} Now
                  </button>
                </form>
              )}

              <div className="flex justify-between pt-4 text-sm text-indigo-600">
                <button onClick={() => navigate("/rupeex-setup")} className="underline">
                  Reconfigure
                </button>
                <button onClick={() => navigate("/rupeex/history")} className="underline">
                  View History
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center py-10 text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-green-700">Transaction Successful</h2>
              <p className="text-gray-600 mt-2">Your ₹{amount} was sent to {receiver}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
