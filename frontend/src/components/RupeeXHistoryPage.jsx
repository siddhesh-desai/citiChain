import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BanknotesIcon,
  DocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  ClipboardDocumentListIcon,
  BuildingLibraryIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const mockInitialTransactions = [
  { id: 1, receiver: "@merchant_store", amount: 240.5, date: "2025-05-21" },
  { id: 2, receiver: "@grocerymart", amount: 589.0, date: "2025-05-19" },
  { id: 3, receiver: "@college_fees", amount: 1200.0, date: "2025-05-15" },
  { id: 4, receiver: "@online_course", amount: 750.0, date: "2025-05-10" },
    { id: 5, receiver: "@bank", amount: 200000.0, date: "2025-05-10" }
];

export default function RupeeXHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("rupeex-history"));
    if (!history || history.length === 0) {
      localStorage.setItem("rupeex-history", JSON.stringify(mockInitialTransactions));
      setTransactions(mockInitialTransactions);
    } else {
      setTransactions(history);
    }

    // Listen for new transaction events (mock for now)
    const interval = setInterval(() => {
      const updated = JSON.parse(localStorage.getItem("rupeex-history"));
      setTransactions(updated || []);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDownloadCSV = () => {
    const csv = [
      ["Receiver", "Amount", "Date"],
      ...transactions.map(tx => [tx.receiver, tx.amount, tx.date]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rupeex-history.csv";
    link.click();
  };

  const handleFilter = (e) => {
    const search = e.target.value.toLowerCase();
    const full = JSON.parse(localStorage.getItem("rupeex-history") || "[]");
    const filtered = full.filter((tx) =>
      tx.receiver.toLowerCase().includes(search)
    );
    setTransactions(filtered);
  };

  const menuLinks = [
    { icon: BanknotesIcon, label: "Dashboard", path: "/dashboard" },
    { icon: DocumentCheckIcon, label: "KYC", path: "/kyc/start" },
    { icon: DocumentDuplicateIcon, label: "Statements", path: "/rupeex/history", active: true },
    { icon: ShieldCheckIcon, label: "Passport", path: "/passport" },
    { icon: BuildingLibraryIcon, label: "Loan", path: "/smart-loan" },
    { icon: CurrencyRupeeIcon, label: "RupeeX", path: "/rupeex" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f4faff] to-[#e6eeff] font-[Inter]">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${menuOpen ? 'w-72' : 'w-20'} bg-[#012B52] text-white p-6 shadow-xl flex flex-col`}>
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
          <button className="mt-6 flex items-center gap-3 px-4 py-2 hover:bg-red-600/10 text-red-300 rounded-xl">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />{menuOpen && "Logout"}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-indigo-200 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-[#012B52] tracking-tight">₹X Transaction History</h2>
            <button
              onClick={handleDownloadCSV}
              className="text-sm bg-white border border-[#012B52] text-[#012B52] font-medium px-4 py-2 rounded-xl hover:bg-indigo-50 transition"
            >
              ⬇️ Download CSV
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by UPI ID..."
            onChange={handleFilter}
            className="w-full border border-gray-300 px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {transactions.length === 0 ? (
            <p className="text-gray-600 text-center text-sm">No transactions found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="py-4 flex justify-between items-center hover:bg-indigo-50 px-4 rounded-xl transition cursor-pointer"
                  onClick={() => alert(`Transaction to ${tx.receiver} of ₹${tx.amount}`)}
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      To: <span className="text-[#012B52]">{tx.receiver}</span>
                    </p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                  <div className="text-green-600 font-bold">– ₹{tx.amount.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}