// Enhanced Smart Loan Dashboard with dynamic updates and multiple loan support
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BanknotesIcon,
  DocumentCheckIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  BuildingLibraryIcon,
  CurrencyRupeeIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const menuLinks = [
  { icon: BanknotesIcon, label: "Dashboard", path: "/dashboard" },
  { icon: DocumentCheckIcon, label: "KYC", path: "/kyc/start" },
  { icon: ArrowUpTrayIcon, label: "Transfer", path: "/transfer-money" },
  { icon: DocumentDuplicateIcon, label: "Statements", path: "/rupeex/history" },
  { icon: ShieldCheckIcon, label: "Passport", path: "/passport" },
  { icon: BuildingLibraryIcon, label: "Loan", path: "/smart-loan", active: true },
  { icon: CurrencyRupeeIcon, label: "RupeeX", path: "/rupeex" }
];

const BLUE = "#012B52";

const initialLoans = [
  {
    id: 1,
    title: "MIT-WPU Education Loan",
    institution: "MIT-WPU, Pune",
    upi: "mitwpu@upi",
    amount: 250000,
    emisPaid: 2,
    totalEmis: 12,
    nextDue: "05 May 2025",
    emiSchedule: [
      { due: "05 Mar 2025", paid: true, amount: 20833 },
      { due: "05 Apr 2025", paid: true, amount: 20833 },
      { due: "05 May 2025", paid: false, amount: 20833 },
      { due: "05 Jun 2025", paid: false, amount: 20833 }
    ]
  },
  {
    id: 2,
    title: "AIIMS DELHI EDUCATION Loan",
    institution: "AIIMS DELHI",
    upi: "aiimsedu@upi",
    amount: 150000,
    emisPaid: 1,
    totalEmis: 10,
    nextDue: "10 May 2025",
    emiSchedule: [
      { due: "10 Mar 2025", paid: true, amount: 15000 },
      { due: "10 Apr 2025", paid: false, amount: 15000 },
      { due: "10 May 2025", paid: false, amount: 15000 }
    ]
  }
];

export default function SmartLoanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [loans, setLoans] = useState(() => {
    const saved = localStorage.getItem("smart-loans");
    return saved ? JSON.parse(saved) : initialLoans;
  });

  useEffect(() => {
    const updateFromTransfer = location.state?.loanUpdate;
    if (updateFromTransfer) {
      const updated = loans.map((loan) => {
        if (loan.id === updateFromTransfer.id) {
          const newSchedule = loan.emiSchedule.map((e) =>
            e.due === updateFromTransfer.due ? { ...e, paid: true } : e
          );
          const emisPaid = newSchedule.filter((e) => e.paid).length;
          const nextDue = newSchedule.find((e) => !e.paid)?.due || "Loan Completed";
          return { ...loan, emiSchedule: newSchedule, emisPaid, nextDue };
        }
        return loan;
      });
      setLoans(updated);
      localStorage.setItem("smart-loans", JSON.stringify(updated));
    }
  }, [location.state]);

  const handlePayEMI = (loan) => {
    const nextEMI = loan.emiSchedule.find((e) => !e.paid);
    if (!nextEMI) return;
    navigate("/transfer-money", {
      state: {
        amount: nextEMI.amount,
        note: `EMI Payment - ${loan.title}`,
        to: loan.upi,
        loanUpdate: { id: loan.id, due: nextEMI.due }
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f4faff] to-[#e6eeff] font-[Inter]">
      <aside className={`transition-all duration-300 ${menuOpen ? 'w-72' : 'w-20'} bg-[${BLUE}] text-white p-6 shadow-xl flex flex-col`}>
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

      <main className="flex-1 px-4 py-10 sm:px-10 bg-[#f9fbfe] text-[#1e293b] overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">
          <h1 className="text-3xl font-bold text-[#012B52]">My Smart Loans</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="bg-white cursor-pointer rounded-xl p-5 shadow hover:shadow-lg transition"
                onClick={() => setSelectedLoanId(loan.id)}
              >
                <h2 className="text-lg font-bold text-[#012B52]">{loan.title}</h2>
                <p className="text-sm text-gray-600 mb-2">Next EMI Due: {loan.nextDue}</p>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={loan.emiSchedule}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="due" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(val) => `₹${val}`} />
                    <Line type="monotone" dataKey="amount" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          {selectedLoanId && (
            <div className="bg-white rounded-2xl p-6 shadow-xl space-y-6">
              {loans.filter(loan => loan.id === selectedLoanId).map((loan) => (
                <>
                  <div className="border-b pb-4">
                    <h2 className="text-2xl font-extrabold text-[#012B52]">{loan.title}</h2>
                    <p className="text-gray-600 text-sm">{loan.institution} ({loan.upi})</p>
                  </div>

                  <div className="grid gap-3 text-sm text-gray-800 leading-6">
                    <p><strong>Loan Amount:</strong> ₹{loan.amount.toLocaleString()}</p>
                    <p><strong>EMI Structure:</strong> ₹{loan.emiSchedule[0].amount.toLocaleString()} x {loan.totalEmis} months</p>
                    <p><strong>Status:</strong> <span className="text-blue-600 font-semibold">Active</span> ({loan.emisPaid} Paid / {loan.totalEmis} Total)</p>
                    <p><strong>Upcoming Due Date:</strong> {loan.nextDue}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#012B52] mb-2">EMI Repayment Timeline</h3>
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 max-h-64 overflow-y-auto border border-gray-200">
                      {loan.emiSchedule.map((emi, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm font-medium border-b border-gray-300 pb-2 last:border-none"
                        >
                          <span>{emi.due}</span>
                          <span className={emi.paid ? "text-green-600" : "text-red-600"}>
                            {emi.paid ? "Paid" : `₹${emi.amount.toLocaleString()}`}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>

                  <button
                    onClick={() => handlePayEMI(loan)}
                    className="mt-4 w-full bg-[#012B52] text-white py-3 rounded-xl font-semibold hover:bg-indigo-900 transition"
                  >
                    Pay Next EMI
                  </button>
                </>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}