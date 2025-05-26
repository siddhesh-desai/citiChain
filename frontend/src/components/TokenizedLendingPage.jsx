import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";

const mockLoan = {
  loanId: "0xLoanID12345",
  etherscanLink: "https://etherscan.io/tx/0xLoanID12345",
  amount: 500000,
  interestRate: "7.2%",
  emi: 41667,
  term: "12 months",
  autoDeduct: true,
  tokenContract: "0xRupeeXTokenAddress",
  repaymentSchedule: [
    { dueDate: "2025-06-01", amount: 41667, paid: false },
    { dueDate: "2025-07-01", amount: 41667, paid: false },
    { dueDate: "2025-08-01", amount: 41667, paid: false },
  ],
};

export default function TokenizedLendingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
          <CurrencyRupeeIcon className="w-7 h-7" />
          Tokenized Lending Overview
        </h1>
        <Link to="/dashboard" className="text-indigo-600 hover:underline flex items-center gap-1">
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Loan Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-2">
        <p><strong>Loan ID:</strong> {mockLoan.loanId}</p>
        <p><strong>Amount:</strong> ₹{mockLoan.amount.toLocaleString()}</p>
        <p><strong>Interest Rate:</strong> {mockLoan.interestRate}</p>
        <p><strong>Term:</strong> {mockLoan.term}</p>
        <p><strong>EMI:</strong> ₹{mockLoan.emi.toLocaleString()}</p>
        <p><strong>Auto-Deduct:</strong> {mockLoan.autoDeduct ? "Enabled" : "Disabled"}</p>
        <p><strong>Token Contract:</strong> <code>{mockLoan.tokenContract}</code></p>
        <a href={mockLoan.etherscanLink} target="_blank" rel="noreferrer" className="text-indigo-600 underline">
          View on Etherscan
        </a>
      </div>

      {/* Repayment Schedule */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Repayment Schedule</h2>
        <ul className="space-y-2">
          {mockLoan.repaymentSchedule.map((item, i) => (
            <li key={i} className="flex justify-between border-b py-2 text-gray-800">
              <span>{item.dueDate}</span>
              <span className={item.paid ? "text-green-600" : "text-red-600"}>
                {item.paid ? "✅ Paid" : `₹${item.amount.toLocaleString()}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
