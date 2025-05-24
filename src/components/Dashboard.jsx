import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BanknotesIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

const mockUser = {
  name: "Rudrika Sharma",
  avatar: "https://i.pravatar.cc/150?u=rudrikasharma",
  accountNumber: "1234 5678 9012 3456",
  balanceINR: 15823.45,
  balanceRupeeX: 2530.78,
  recentTransactions: [
    { id: 1, description: "Grocery Store", amount: -45.67, date: "2025-05-21" },
    { id: 2, description: "Salary Credit", amount: 2500.0, date: "2025-05-20" },
    { id: 3, description: "Electricity Bill", amount: -120.5, date: "2025-05-18" },
  ],
  kycStatus: "verified",
  zkpVerified: true,
  reputation: {
    creditScore: 780,
    loanBehavior: "Good",
    soulboundNFT: "0xABC123...DEF456",
    did: "did:citi:rudrika123",
  },
  consentLedger: [
    { id: 1, dataRequester: "Loan Service", date: "2025-05-20", access: "Granted", merkleProof: "#" },
    { id: 2, dataRequester: "Merchant A", date: "2025-05-19", access: "Revoked", merkleProof: "#" },
  ],
  smartLoan: {
    active: true,
    college: "IIT Bombay",
    amount: 5_00_000,
    purposeLocked: true,
    merchant: "Bookstore Co.",
    emiPaid: 4,
    emiTotal: 12,
    emiNextDue: "2025-06-01",
  },
  tokenizedLoan: {
    loanId: "0xLoanID12345",
    etherscanLink: "https://etherscan.io/tx/0xLoanID12345",
    repaymentSchedule: [
      { dueDate: "2025-06-01", amount: 41667, paid: false },
      { dueDate: "2025-07-01", amount: 41667, paid: false },
    ],
    autoDeduct: true,
    oracleFeed: "https://chain.link/oracle-feed",
  },
};

export default function CitiChainDashboard() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hello! I'm CitiGPT, your financial assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), from: "user", text: input.trim() };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");

    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        from: "bot",
        text: "Sorry, I'm still learning and cannot answer that yet.",
      };
      setMessages((msgs) => [...msgs, botReply]);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg flex flex-col p-6">
        <div className="flex items-center gap-4 mb-10">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Citi.svg/1200px-Citi.svg.png"
            alt="CitiChain Logo"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="text-2xl font-bold">{mockUser.name}</h2>
            <p className="text-indigo-600 font-semibold">Premium Account</p>
            <p className="mt-1 text-sm text-gray-500">{mockUser.accountNumber}</p>
          </div>
        </div>

        <nav className="flex flex-col space-y-4 text-indigo-700 font-semibold text-lg">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
          >
            <BanknotesIcon className="w-6 h-6" />
            Dashboard
          </button>
          <button
            onClick={() => navigate("/kyc/start")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-100 transition"
          >
            <DocumentCheckIcon className="w-6 h-6" />
            KYC
          </button>
          <button
            onClick={() => navigate("/transfer")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-100 transition"
          >
            <ArrowUpTrayIcon className="w-6 h-6" />
            Transfer Money
          </button>
          <button
            onClick={() => navigate("/cards")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-100 transition"
          >
            <CreditCardIcon className="w-6 h-6" />
            Cards
          </button>
          <button
            onClick={() => navigate("/statements")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-100 transition"
          >
            <DocumentDuplicateIcon className="w-6 h-6" />
            Statements
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              alert("Logged out");
              navigate("/login");
            }}
            className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-100 text-red-600 font-semibold transition"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 max-w-7xl mx-auto overflow-y-auto space-y-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold">Welcome back, {mockUser.name}</h1>
          <button
            onClick={() => setChatOpen((open) => !open)}
            title="Toggle CitiGPT Chat"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition"
          >
            <ChatBubbleLeftRightIcon className="w-7 h-7" />
          </button>
        </header>

        {/* Summary Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* OneKYC Status */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">OneKYC Status</h2>
              {mockUser.zkpVerified && (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <CheckBadgeIcon className="w-6 h-6" />
                  Verified (ZKP)
                </div>
              )}
            </div>
            <p className="text-gray-600">Your KYC is {mockUser.kycStatus} with zero-knowledge proof verification.</p>
          </div>

          {/* Account Balances */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Balances</h2>
            <div className="flex flex-col space-y-3 text-gray-800 font-medium text-lg">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>INR</span>
                <span>₹ {mockUser.balanceINR.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span>RupeeX Stablecoin</span>
                <span>{mockUser.balanceRupeeX.toLocaleString(undefined, { minimumFractionDigits: 2 })} ₹X</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
            <ul className="divide-y divide-gray-200 max-h-48 overflow-y-auto">
              {mockUser.recentTransactions.map(({ id, description, amount, date }) => (
                <li key={id} className="py-2 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{description}</p>
                    <p className="text-sm text-gray-500">{date}</p>
                  </div>
                  <span className={`font-semibold ${amount < 0 ? "text-red-600" : "text-green-600"}`}>
                    {amount < 0 ? "-" : "+"}₹{Math.abs(amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Services Section */}
        <section className="space-y-10">
          <h2 className="text-3xl font-bold border-b-4 border-indigo-600 pb-2 mb-6">Services</h2>

          {/* OneKYC & ZKPs */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-7 h-7 text-indigo-600" />
              OneKYC & ZKP Verification
            </h3>
            <p>Your identity is securely verified using zero-knowledge proofs.</p>
            <p className="mt-3">
              KYC Status:{" "}
              <span className={`font-semibold ${mockUser.kycStatus === "verified" ? "text-green-600" : "text-red-600"}`}>
                {mockUser.kycStatus.charAt(0).toUpperCase() + mockUser.kycStatus.slice(1)}
              </span>
            </p>
            <p>ZKP Verified: {mockUser.zkpVerified ? "Yes ✅" : "No ❌"}</p>
          </div>

          {/* Reputation Passport */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-7 h-7 text-indigo-600" />
              Reputation Passport (Soulbound NFTs & DID)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Credit Score: <strong>{mockUser.reputation.creditScore}</strong></li>
              <li>Loan Behavior: <strong>{mockUser.reputation.loanBehavior}</strong></li>
              <li>Soulbound NFT: <code className="bg-gray-100 px-1 rounded">{mockUser.reputation.soulboundNFT}</code></li>
              <li>DID: <code className="bg-gray-100 px-1 rounded">{mockUser.reputation.did}</code></li>
            </ul>
          </div>

          {/* Consent Ledger */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-7 h-7 text-indigo-600" />
              Consent Ledger (Merkle Trees + IPFS)
            </h3>
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="border border-gray-300 px-3 py-2">Data Requester</th>
                  <th className="border border-gray-300 px-3 py-2">Date</th>
                  <th className="border border-gray-300 px-3 py-2">Access</th>
                  <th className="border border-gray-300 px-3 py-2">Merkle Proof</th>
                </tr>
              </thead>
              <tbody>
                {mockUser.consentLedger.map(({ id, dataRequester, date, access, merkleProof }) => (
                  <tr key={id} className="hover:bg-indigo-50">
                    <td className="border border-gray-300 px-3 py-2">{dataRequester}</td>
                    <td className="border border-gray-300 px-3 py-2">{date}</td>
                    <td className={`border border-gray-300 px-3 py-2 font-semibold ${access === "Granted" ? "text-green-600" : "text-red-600"}`}>
                      {access}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <a href={merkleProof} target="_blank" rel="noreferrer" className="text-indigo-600 underline">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Smart Loan */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <BuildingLibraryIcon className="w-7 h-7 text-indigo-600" />
              Smart Loan (Merchant-locked)
            </h3>
            {mockUser.smartLoan.active ? (
              <div className="space-y-2 text-gray-700">
                <p>College: <strong>{mockUser.smartLoan.college}</strong></p>
                <p>Amount: <strong>₹ {mockUser.smartLoan.amount.toLocaleString()}</strong></p>
                <p>Purpose Locked: <strong>{mockUser.smartLoan.purposeLocked ? "Yes" : "No"}</strong></p>
                <p>Merchant: <strong>{mockUser.smartLoan.merchant}</strong></p>
                <p>EMI Paid: <strong>{mockUser.smartLoan.emiPaid} / {mockUser.smartLoan.emiTotal}</strong></p>
                <p>Next EMI Due: <strong>{mockUser.smartLoan.emiNextDue}</strong></p>
              </div>
            ) : (
              <p className="text-red-600 font-semibold">No active smart loan</p>
            )}
          </div>

          {/* Tokenized EMI Loan */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CurrencyRupeeIcon className="w-7 h-7 text-indigo-600" />
              Tokenized EMI & Lending
            </h3>
            <p>Loan ID: <code className="bg-gray-100 px-1 rounded">{mockUser.tokenizedLoan.loanId}</code></p>
            <p>
              Etherscan:{" "}
              <a
                href={mockUser.tokenizedLoan.etherscanLink}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 underline"
              >
                View Transaction
              </a>
            </p>
            <p className="mt-3 font-semibold">Repayment Schedule:</p>
            <ul className="list-disc list-inside space-y-1">
              {mockUser.tokenizedLoan.repaymentSchedule.map(({ dueDate, amount, paid }, i) => (
                <li key={i} className={paid ? "line-through text-green-600" : ""}>
                  {dueDate} : ₹ {amount.toLocaleString()} — {paid ? "Paid" : "Pending"}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Auto-Deduct EMI:{" "}
              <strong>{mockUser.tokenizedLoan.autoDeduct ? "Enabled ✅" : "Disabled ❌"}</strong>
            </p>
            <p>
              Oracle Feed:{" "}
              <a
                href={mockUser.tokenizedLoan.oracleFeed}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 underline"
              >
                {mockUser.tokenizedLoan.oracleFeed}
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* CitiGPT Chatbot Panel */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col border border-indigo-600">
          <header className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded-t-xl">
            <h2 className="text-lg font-bold">CitiGPT</h2>
            <button onClick={() => setChatOpen(false)} title="Close Chat" className="hover:opacity-80">
              ✕
            </button>
          </header>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-indigo-50">
            {messages.map(({ id, from, text }) => (
              <div
                key={id}
                className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                  from === "bot"
                    ? "bg-indigo-100 text-indigo-900 self-start"
                    : "bg-indigo-600 text-white self-end"
                }`}
              >
                {text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex border-t border-indigo-300"
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask CitiGPT..."
              className="flex-1 p-3 resize-none outline-none border-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-r-xl transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
