import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

import FloatingChatBot from "../components/FloatingChatBot";
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
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const mockUser = {
  name: "Rudrika Sharma",
  avatar: "https://i.pravatar.cc/150?u=rudrikasharma",
  accountNumber: "1234 5678 9012 3456",
  passportNumber: "CITI-123X@432XHG",
  balanceINR: 204932.45,
  balanceRupeeX: 8230.0,
  recentTransactions: [
    {
      id: 1,
      description: "Zomato Payment",
      amount: -345.67,
      date: "2025-05-21",
    },
    {
      id: 2,
      description: "UPI Received - CitiChain",
      amount: 200000,
      date: "2025-05-20",
    },
    {
      id: 3,
      description: "Electricity Bill",
      amount: -1020.5,
      date: "2025-05-18",
    },
    {
      id: 4,
      description: "Spotify Subscription",
      amount: -199,
      date: "2025-05-17",
    },
    {
      id: 5,
      description: "Freelance Credit - Code Studio",
      amount: 18000,
      date: "2025-05-16",
    },
    {
      id: 6,
      description: "Amazon Order #5493",
      amount: -1999.0,
      date: "2025-05-15",
    },
    {
      id: 7,
      description: "Phone Recharge - Airtel",
      amount: -349.0,
      date: "2025-05-14",
    },
    {
      id: 8,
      description: "Interest Received",
      amount: 450.0,
      date: "2025-05-13",
    },
    {
      id: 9,
      description: "CitiChain Rewards",
      amount: 750.0,
      date: "2025-05-12",
    },
    {
      id: 10,
      description: "IRCTC Train Ticket",
      amount: -850.0,
      date: "2025-05-11",
    },
  ],
  rupeeXHistory: [
    {
      id: 1,
      type: "Sent",
      amount: -1250,
      to: "@edTechPro",
      date: "2025-05-25",
    },
    { id: 3, type: "Staked", amount: -2000, date: "2025-05-23" },
    {
      id: 4,
      type: "Received",
      amount: 3500,
      from: "@devGuild",
      date: "2025-05-22",
    },
    { id: 5, type: "Sent", amount: -1800, to: "@neoBank", date: "2025-05-21" },
    { id: 6, type: "Sent", amount: -1300, to: "@neoBank", date: "2025-05-21" },
    {
      id: 7,
      type: "Sent",
      amount: -1800,
      to: "IRCTC Ticket",
      date: "2025-05-11",
    },
    {
      id: 8,
      type: "Received",
      amount: 18400,
      from: "radhika apte",
      date: "2025-04-21",
    },
  ],
  emis: [
    { id: 1, label: "Laptop Loan", amount: 1500, status: "Pending" },
    { id: 2, label: "Tuition Fee", amount: 2000, status: "Paid" },
    { id: 3, label: "Bike EMI", amount: 1200, status: "Pending" },
  ],
};

const chartData = [
  { name: "Food", Amount: 345.67 },
  { name: "Bills", Amount: 1020.5 },
  { name: "Subscription", Amount: 199 },
  { name: "Freelance", Amount: 18000 },
  { name: "CitiChain", Amount: 200000 },
];

const COLORS = ["#34D399", "#60A5FA"];
const pieData = [
  {
    name: "Paid",
    value: mockUser.emis.filter((e) => e.status === "Paid").length,
  },
  {
    name: "Pending",
    value: mockUser.emis.filter((e) => e.status === "Pending").length,
  },
];

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear auth tokens, user data, etc.
    localStorage.removeItem("authToken"); // example
    // Redirect to login or landing page
    navigate("/login");
  };

  return (
    <div className="flex bg-white min-h-screen text-gray-900 font-sans relative">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ${
          menuOpen ? "w-72" : "w-20"
        } bg-[#012B52] text-white p-6 shadow-xl border-r border-indigo-500/10 flex flex-col`}
      >
        <div className="flex justify-between items-center mb-8">
          {menuOpen && (
            <div>
              <h2 className="text-xl font-bold">Welcome, {mockUser.name}</h2>
              <p className="text-sm text-indigo-200">
                A/C: {mockUser.accountNumber}
              </p>
              <p className="text-xs text-indigo-300 truncate">
                Passport: {mockUser.passportNumber}
              </p>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl"
          >
            <BanknotesIcon className="w-5 h-5" />
            {menuOpen && "Dashboard"}
          </Link>
          <Link
            to="/kyc/start"
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl"
          >
            <DocumentCheckIcon className="w-5 h-5" />
            {menuOpen && "KYC"}
          </Link>
          <Link
            to="/rupeex/history"
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl"
          >
            <DocumentDuplicateIcon className="w-5 h-5" />
            {menuOpen && "Statements"}
          </Link>
          <Link
            to="/passport"
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl"
          >
            <ShieldCheckIcon className="w-5 h-5" />
            {menuOpen && "Passport"}
          </Link>
          <Link
            to="/smart-loan"
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl"
          >
            <BuildingLibraryIcon className="w-5 h-5" />
            {menuOpen && "Loan"}
          </Link>
          <Link
            to="/rupeex"
            className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl"
          >
            <CurrencyRupeeIcon className="w-5 h-5" />
            {menuOpen && "RupeeX Transfer"}
          </Link>
          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-3 px-4 py-2 hover:bg-red-600/10 text-red-300 rounded-xl"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            {menuOpen && "Logout"}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-10 bg-white">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow">
            <p className="text-sm text-gray-500">Balance INR</p>
            <h2 className="text-2xl font-bold">
              ₹ {mockUser.balanceINR.toLocaleString()}
            </h2>
          </div>
          <div className="bg-white border border-indigo-200 rounded-2xl p-6 shadow">
            <p className="text-sm text-gray-500">Balance RupeeX</p>
            <h2 className="text-2xl font-bold">{mockUser.balanceRupeeX} ₹X</h2>
          </div>
          <div className="bg-white border border-green-200 rounded-2xl p-6 flex items-center gap-3">
            <CheckBadgeIcon className="w-6 h-6 text-green-600" />
            <span className="text-lg font-medium">KYC Verified</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Transaction Overview
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              EMI Status
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="bg-gradient-to-br from-blue-100 via-blue-50 to-white border border-blue-300 rounded-2xl p-6 shadow max-w-full max-h-72 overflow-y-auto">
          <p className="text-xs uppercase tracking-wider font-bold text-blue-500 mb-1">
            Citi Loyalty Token
          </p>
          <h2 className="text-3xl font-extrabold text-blue-700 mb-4">
            1,500 Coins
          </h2>
          <div className="space-y-3">
            {[
              {
                id: 1,
                coins: 300,
                desc: "Completed AI OneKYC with verified identity and facial match",
                date: "2025-05-20",
              },
              {
                id: 2,
                coins: 250,
                desc: "Maintained average wallet balance above ₹10,000 for 30 days",
                date: "2025-05-22",
              },
              {
                id: 3,
                coins: 200,
                desc: "Successfully repaid loan on schedule with no penalties",
                date: "2025-05-23",
              },
              {
                id: 4,
                coins: 300,
                desc: "Referred and onboarded an active verified merchant",
                date: "2025-05-24",
              },
              {
                id: 7,
                coins: 400,
                desc: "Used RupeeX to support education or healthcare via verified partners",
                date: "2025-05-27",
              },
              {
                id: 6,
                coins: 500,
                desc: "Upgraded to Gold Tier with over ₹1,00,000 in transaction volume",
                date: "2025-05-26",
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-blue-800 font-medium bg-blue-100 rounded px-4 py-2 shadow-sm"
              >
                <span>{item.desc}</span>
                <span>+{item.coins} Coins</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Card Panel with Recent Transactions */}
      <aside className="w-96 bg-[#012B52] text-white p-6 flex flex-col justify-between shadow-xl rounded-l-3xl">
        <div>
          <h2 className="text-lg font-semibold mb-2">My Card</h2>
          <p className="text-sm text-gray-200">Balance</p>
          <h1 className="text-2xl font-bold mt-1">₹204,932.45</h1>
          <p className="text-sm mt-3">💳 {mockUser.accountNumber}</p>
          <div className="mt-4">
            <p className="text-sm">Interest Limit</p>
            <div className="w-full h-2 bg-white/20 rounded-full mt-1">
              <div className="w-[80%] h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-sm mt-1">160,000 / 200,000</p>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold mb-2">RupeeX History</h3>
            <ul className="space-y-2 text-sm max-h-60 overflow-y-auto pr-1">
              {mockUser.rupeeXHistory.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between border-b border-white/10 pb-1"
                >
                  <span>
                    {item.type} {item.to || item.from || ""} ({item.date})
                  </span>
                  <span
                    className={
                      item.amount < 0 ? "text-red-300" : "text-green-300"
                    }
                  >
                    {item.amount < 0 ? "-" : "+"}₹{Math.abs(item.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold">Send money to:</p>
          <div className="flex gap-3 mt-2">
            {[
              "https://randomuser.me/api/portraits/women/79.jpg",
              "https://randomuser.me/api/portraits/men/32.jpg",
              "https://randomuser.me/api/portraits/women/45.jpg",
              "https://randomuser.me/api/portraits/men/67.jpg",
            ].map((url, index) => (
              <img
                key={index}
                src={url}
                alt="recipient"
                className="w-10 h-10 rounded-full object-cover border border-white"
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Floating Chatbot */}
      <FloatingChatBot />
    </div>
  );
}
