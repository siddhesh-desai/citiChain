import React from "react";

const BankDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-[#1B235F] text-white px-8 py-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">CitiChain Admin</h1>
        <nav className="space-x-8">
          <a
            href="#"
            className="hover:underline font-medium transition-colors duration-200"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="hover:underline font-medium transition-colors duration-200"
          >
            KYC Requests
          </a>
          <a
            href="#"
            className="hover:underline font-medium transition-colors duration-200"
          >
            Loan Requests
          </a>
          <a
            href="#"
            className="hover:underline font-medium transition-colors duration-200"
          >
            Stablecoin
          </a>
          <a
            href="#"
            className="hover:underline font-medium transition-colors duration-200"
          >
            Passport
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-10 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-gray-900">
          Welcome, Admin
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Pending KYCs
            </h3>
            <p className="text-gray-600 text-3xl font-semibold">12</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Stablecoin Issued
            </h3>
            <p className="text-gray-600 text-3xl font-semibold">₹9.2 Cr</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Active Loans
            </h3>
            <p className="text-gray-600 text-3xl font-semibold">35</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BankDashboard;
