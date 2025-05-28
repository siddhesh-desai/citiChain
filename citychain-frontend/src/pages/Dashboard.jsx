import React, { useState, useEffect } from "react";
import { getAccountDetails, getBalance, getnewAccountDetails} from "../services/accountDetails";
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import FloatingChatBot from "../components/FloatingChatbot";

const Dashboard = () => {
  const [accountData, setAccountData] = useState(null);
  const [newAccountData, setNewAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for new features
  const [reputationScore] = useState(0);
  const [activeLoan] = useState({
    amount: 500000,
    paid: 150000,
    total: 500000,
    type: "Education Loan",
    nextPayment: "2024-02-15",
  });

  const [consentHistory] = useState([
    {
      institution: "HDFC Bank",
      dataType: "Credit History",
      timestamp: "2 hours ago",
    },
    {
      institution: "ICICI Bank",
      dataType: "Transaction Data",
      timestamp: "1 day ago",
    },
    {
      institution: "SBI",
      dataType: "Income Verification",
      timestamp: "3 days ago",
    },
  ]);

  const [tokenizedEMIs] = useState([
    {
      loanType: "Education Loan",
      nextPayment: "Feb 15, 2024",
      amount: 12500,
      status: "active",
    },
    {
      loanType: "Personal Loan",
      nextPayment: "Feb 20, 2024",
      amount: 8500,
      status: "active",
    },
  ]);

  // useEffect(() => {
  //   const fetchAccountData = async () => {
  //     try {
  //       const data = await getAccountDetails();
  //       setAccountData(data);
  //     } catch (error) {
  //       console.error("Error fetching account data:", error);
  //       setError("Failed to load account data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const fetchBalance = async () => {
  //     try {
  //       const balance = await getBalance();
  //       if (accountData) {
  //         setAccountData((prevData) => ({ 
  //           ...prevData,
  //           current_balance: balance,
  //         }));
  //       }
  //     } catch (error) {
  //       console.error("Error fetching balance:", error);
  //       setError("Failed to load balance data");
  //     }
  //   };
    
  //   fetchAccountData();
  //   fetchBalance();
  // }, []);

  // Enhanced stats with reputation score
  
  useEffect(() => {
  const fetchAllData = async () => {
    try {
      const [account, balance, details] = await Promise.all([
        getAccountDetails(),
        getBalance(),
        getnewAccountDetails(),
      ]);
      setAccountData({
        ...account,
        current_balance: balance,
      });
      setNewAccountData(details);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load account or balance data");
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, []);


  const stats = accountData
    ? [
        {
          name: "Current Balance",
          value: showBalance
            ? `₹${accountData.current_balance?.toLocaleString()}`
            : "₹••••••",
          icon: BanknotesIcon,
          change: "+100%",
          changeType: "increase",
        },
        {
          name: "Monthly Income",
          value: `₹${accountData.current_balance?.toLocaleString() || accountData.monthly_income?.toLocaleString()}`,
          icon: ArrowUpIcon,
          change: "+100%",
          changeType: "increase",
        },
        {
          name: "Reputation Score",
          value: `${0 && reputationScore}/1000`,
          icon: ShieldCheckIcon,
          change: "+0 pts",
          changeType: "increase",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            CitiChain Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {newAccountData.name || accountData?.user_id?.fullname || "User"}! Your
            blockchain banking overview.
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-blue-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.name === "Current Balance" && (
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {showBalance ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : stat.changeType === "decrease"
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      from last month
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-white rounded-xl shadow-sm border my-6  border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-blue-50 text-blue-600 p-4 rounded-lg hover:bg-blue-100 transition-colors flex flex-col items-center">
              <PlusIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">Transfer Money</span>
            </button>
            <button className="bg-purple-50 text-purple-600 p-4 rounded-lg hover:bg-purple-100 transition-colors flex flex-col items-center">
              <ShieldCheckIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">Update KYC</span>
            </button>
            <button className="bg-orange-50 text-orange-600 p-4 rounded-lg hover:bg-orange-100 transition-colors flex flex-col items-center">
              <AcademicCapIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">Apply Loan</span>
            </button>
            <button className="bg-emerald-50 text-emerald-600 p-4 rounded-lg hover:bg-emerald-100 transition-colors flex flex-col items-center">
              <DocumentTextIcon className="h-6 w-6 mb-2" />
              <span className="text-sm">View Reports</span>
            </button>
          </div>
        </div>

        {/* Main Dashboard Grid - Account Card & Reputation Passport */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Enhanced Account Card */}
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">CitiChain Account</h3>
              <CreditCardIcon className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-90">Account Number</p>
              <p className="text-xl font-mono">
                {newAccountData._id || accountData?.account_number || "**** **** **** ****"}
              </p>
              <div className="flex justify-between items-end mt-4">
                <div>
                  <p className="text-sm opacity-90">Account Holder</p>
                  <p className="font-semibold">
                    {newAccountData.name || accountData?.user_id?.fullname || "Account Holder"}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-90">IFSC Code</p>
                  <p className="font-semibold">
                    {accountData?.ifsc_code || "CITI0001234"}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <p className="text-sm opacity-90">Wallet Address</p>
                  <p className="font-semibold capitalize">
                    {newAccountData.wallet_address || accountData?.account_type || "Savings"}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Blockchain Status</p>
                  <p className="font-semibold">🔗 Connected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reputation Passport Widget */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold mb-4 text-purple-800">
              Reputation Passport
            </h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  {reputationScore}
                </p>
                <p className="text-sm text-gray-500">Credit Score</p>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Soulbound NFT</span>
                <span className="text-green-600">✓ Minted</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span>DID Status</span>
                <span className="text-green-600">✓ Active</span>
              </div> */}
              <div className="flex justify-between text-sm">
                <span>Financial Identity</span>
                <span className="text-blue-600">Shareable</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-purple-50 text-purple-600 p-2 rounded-lg text-sm hover:bg-purple-100">
              View Passport Details
            </button>
          </div>
        </div>
        {/* OneKYC and Smart Loans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* OneKYC Status Widget */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
            <h3 className="text-lg font-semibold mb-4 text-green-800">
              <ShieldCheckIcon className="h-5 w-5 inline mr-2" />
              OneKYC Status
            </h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Verified with ZKPs</p>
                <p className="text-sm text-gray-500">
                  Valid across all partner banks
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm">AI OCR Verification</span>
                <span className="text-green-600 text-sm font-medium">
                  ✓ Complete
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm">Facial Recognition</span>
                <span className="text-green-600 text-sm font-medium">
                  ✓ Complete
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm">Zero-Knowledge Proof</span>
                <span className="text-green-600 text-sm font-medium">
                  ✓ Generated
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm">Semaphore Integration</span>
                <span className="text-blue-600 text-sm font-medium">
                  🔐 Privacy Protected
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                Your identity is verified once and can be used across all
                CitiChain partner banks without re-verification.
              </p>
            </div>
          </div>

          {/* Smart Loans Dashboard */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
            <h3 className="text-lg font-semibold mb-4 text-orange-800">
              <AcademicCapIcon className="h-5 w-5 inline mr-2" />
              Smart Loans
            </h3>
            {activeLoan ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{activeLoan.type}</span>
                  <span className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total Loan Amount</span>
                    <span className="font-semibold">
                      ₹{activeLoan.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(activeLoan.paid / activeLoan.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Paid: ₹{activeLoan.paid.toLocaleString()}</span>
                    <span>
                      {Math.round((activeLoan.paid / activeLoan.total) * 100)}%
                      Complete
                    </span>
                  </div>
                </div>

                <div className="border border-orange-200 p-3 rounded-lg">
                  <p className="text-sm text-orange-700 mb-2">
                    <span className="font-medium">
                      🏫 Verified Institution Usage Only
                    </span>
                  </p>
                  <p className="text-xs text-gray-600">
                    This loan can only be used at verified educational
                    institutions through our merchant registry system.
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-orange-50 text-orange-600 p-2 rounded-lg text-sm hover:bg-orange-100">
                    View Usage History
                  </button>
                  <button className="flex-1 bg-orange-600 text-white p-2 rounded-lg text-sm hover:bg-orange-700">
                    Make Payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No active smart loans</p>
                <button className="w-full bg-orange-50 text-orange-600 p-3 rounded-lg hover:bg-orange-100 transition-colors">
                  Apply for Smart Loan
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Purpose-driven lending with fraud protection
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Consent Ledger and Tokenized EMI Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Consent Ledger */}
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
            <h3 className="text-lg font-semibold mb-4 text-indigo-800">
              <DocumentTextIcon className="h-5 w-5 inline mr-2" />
              Consent Ledger
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tamper-proof data access history using Merkle Trees + IPFS
            </p>
            <div className="space-y-3">
              {consentHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                      <DocumentTextIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-indigo-800">
                        {item.institution}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.dataType} accessed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {item.timestamp}
                    </span>
                    <div className="text-xs text-green-600">✓ Verified</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo-700">
                  Smart Contract Permissions
                </span>
                <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Selective sharing enabled with cryptographic proof
              </p>
            </div>
            <button className="mt-4 w-full bg-indigo-50 text-indigo-600 p-2 rounded-lg text-sm hover:bg-indigo-100">
              Manage Data Permissions
            </button>
          </div>

          {/* Tokenized EMI Tracker */}
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
            <h3 className="text-lg font-semibold mb-4 text-emerald-800">
              💎 Tokenized EMI & Lending
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Smart contract-driven loans with automated repayments
            </p>
            <div className="space-y-4">
              {tokenizedEMIs.map((emi, index) => (
                <div
                  key={index}
                  className="border border-emerald-200 rounded-lg p-4 bg-emerald-50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-emerald-800">
                      {emi.loanType}
                    </span>
                    <span className="text-sm bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full flex items-center">
                      🤖 Auto-pay ON
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Payment:</span>
                      <span className="font-medium">{emi.nextPayment}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-emerald-600">
                        ₹{emi.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Chainlink Oracle:</span>
                      <span className="text-blue-600">✓ Connected</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">TimeLock Status:</span>
                      <span className="text-green-600">🔒 Secured</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-700 font-medium mb-1">
                🔗 Powered by Solidity Smart Contracts
              </p>
              <p className="text-xs text-gray-600">
                Dynamic tracking with spending controls and automated execution
              </p>
            </div>
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-emerald-50 text-emerald-600 p-2 rounded-lg text-sm hover:bg-emerald-100">
                View Contracts
              </button>
              <button className="flex-1 bg-emerald-600 text-white p-2 rounded-lg text-sm hover:bg-emerald-700">
                Manage EMIs
              </button>
            </div>
          </div>
        </div>
        <FloatingChatBot />
      </div>
    </div>
  );
};

export default Dashboard;
