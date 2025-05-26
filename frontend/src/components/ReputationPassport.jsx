/* Full file updated: Added CSV download button, made access log scrollable, and added more mock data */

import React, { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import {
  BanknotesIcon,
  DocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  CurrencyRupeeIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const MID_ROYAL_BLUE = "#012B52";

const menuLinks = [
  { icon: BanknotesIcon, label: "Dashboard", path: "/dashboard" },
  { icon: DocumentCheckIcon, label: "KYC", path: "/kyc/start" },
  { icon: DocumentDuplicateIcon, label: "Statements", path: "/rupeex/history" },
  { icon: ShieldCheckIcon, label: "Passport", path: "/passport", active: true },
  { icon: BuildingLibraryIcon, label: "Loan", path: "/smart-loan" },
  { icon: CurrencyRupeeIcon, label: "RupeeX", path: "/rupeex" },
];

export default function ReputationPassport() {
  const [copied, setCopied] = useState(false);
  const [reputationScore] = useState(812);
  const [txCount] = useState(112);
  const [did] = useState("did:ethr:0x23Bf8E34Cc9012C7D35FdEf9fAA6a9a7e4bA2143");
  const [qrURL] = useState("http://localhost:3000/verify?did=0x23Bf8E34Cc9012C7D35FdEf9fAA6a9a7e4bA2143");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(did);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadCSV = () => {
    const rows = [
      ["Bank", "Detail", "Date"],
      ...accessLogs.map((log) => [log.bank, log.detail, log.time])
    ];
    const csv = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "access-log.csv";
    link.click();
  };

  const accessLogs = [
    { bank: "Axis Bank", detail: "Requested credit profile for home loan verification", time: "2 days ago" },
    { bank: "CRED", detail: "Auto-check performed for reward eligibility", time: "5 days ago" },
    { bank: "Jupiter", detail: "Checked EMI repayment schedule via APIs", time: "10 days ago" },
    { bank: "Citi Bank", detail: "Reviewed financial insights for smart credit card", time: "12 days ago" },
    { bank: "Yes Bank", detail: "Evaluated savings history for student loan", time: "15 days ago" },
    { bank: "Paytm Bank", detail: "Queried digital wallet load patterns", time: "18 days ago" },
    { bank: "Bajaj Finserv", detail: "Reviewed credit health for EMI offers", time: "22 days ago" },
    { bank: "HDFC", detail: "Checked long-term behavior for home insurance", time: "25 days ago" }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f4faff] to-[#e6eeff] font-[Inter]">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${menuOpen ? 'w-72' : 'w-20'} bg-[${MID_ROYAL_BLUE}] text-white p-6 shadow-xl flex flex-col`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-xl font-semibold tracking-wide ${menuOpen ? 'block' : 'hidden'}`}>CitiChain</h2>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
        <nav className="space-y-4">
          {menuLinks.map(({ icon: Icon, label, path, active }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left ${active ? 'bg-white/10 text-indigo-200' : 'hover:bg-white/10'} transition-all`}
            >
              <Icon className="w-6 h-6 shrink-0" />
              {menuOpen && <span className="transition-all">{label}</span>}
            </button>
          ))}
          <button onClick={() => navigate("/login")} className="mt-6 flex items-center gap-3 px-4 py-2 hover:bg-red-600/10 text-red-300 rounded-xl">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />{menuOpen && "Logout"}
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 px-4 py-10 sm:px-10 bg-[#f9fbfe] text-[#1e293b] overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-[#012B52]">Reputation Passport</h1>
            <p className="text-lg font-medium text-gray-600 mt-2">Passport: <span className="font-mono text-indigo-700">CITI-123X@432XHG</span></p>
          </div>

          <section>
            <h2 className="text-xl font-bold mb-4">Verified Identity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white rounded-2xl p-6 shadow-md">
              <InfoItem label="Full Name" value="Rudrika Sharma" />
              <InfoItem label="Gender" value="Female" />
              <InfoItem label="DOB" value="15 April 1998" />
              <InfoItem label="Phone" value="+91-98231-64891" />
              <InfoItem label="Email" value="rudrika.sharma@citichain.xyz" />
              <InfoItem label="KYC Status" value="Verified via Citi Bank" />
              <InfoItem label="KYC Last Updated" value="04 May 2024" />
              <InfoItem label="Next KYC Due" value="03 May 2026" />
              <InfoItem label="Institutions Linked" value="HDFC, Axis, Jupiter, CRED, Citi" spanCols />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Reputation Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Reputation Score" value={reputationScore} suffix=" / 900" />
              <StatCard label="Verified Transactions" value={txCount} />
              <StatCard label="Loyalty Tier" value="Platinum" />
              <StatCard label="Institutions Linked" value={5} />
            </div>
            <p className="text-sm italic text-gray-500 mt-2">
              AI Insight: Strong payment history, early loan clearance, trusted by multiple banks.
            </p>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Access Log</h2>
              <button onClick={handleDownloadCSV} className="text-sm bg-white border border-[#012B52] text-[#012B52] font-medium px-4 py-2 rounded hover:bg-indigo-50 transition">⬇️ Download CSV</button>
            </div>
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {accessLogs.map((log, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow p-4">
                  <p className="font-semibold text-[#012B52]">{log.bank}</p>
                  <p className="text-sm text-gray-700">{log.detail}</p>
                  <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">QR Code</h2>
            <p className="text-sm text-gray-600 mb-2">Scan to view or verify your passport:</p>
            <div className="bg-white p-4 rounded-lg shadow-md w-fit">
              <QRCode value={qrURL} size={160} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, suffix = "" }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow text-center text-[#012B52] font-semibold">
      <div className="text-3xl font-extrabold mb-2">
        {value}
        {suffix && <span className="text-xl font-medium">{suffix}</span>}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function InfoItem({ label, value, spanCols = false }) {
  return (
    <div className={spanCols ? "col-span-2" : ""}>
      <p className="text-sm text-gray-500 mb-1 font-medium">{label}</p>
      <p className="text-base font-semibold text-[#012B52]">{value}</p>
    </div>
  );
}
