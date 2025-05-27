import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./components/Signup";
import Login from "./components/Login";            
import OTPVerify from "./components/OTPVerify";
import TransferMoneyPage from "./components/TransferMoneyPage"; 
import Dashboard from "./components/Dashboard";
import KYCStatus from "./pages/KYCStatus"; 

// KYC Steps
import KYCStartDecision from "./components/KYCStartDecision";
import KYCUpload from "./components/KYCUpload";
import KYCLivePhoto from "./components/KYCLivePhoto";
import KYCReview from "./components/KYCReview";
import KYCAddress from "./components/KYCAddress";
import KYCDeclaration from "./components/KYCDeclaration";
import KYCDetails from "./components/KYCDetails"; 
import WelcomePage from "./pages/WelcomePage";
import PassportStatusPage from "./components/PassportStatusPage"; 
import PassportStatusEntry from "./components/PassportStatusEntry";

//passport 

import ReputationPassport from "./components/ReputationPassport"; 
import SmartLoanPage from "./components/SmartLoanPage";
import TokenizedLendingPage from "./components/TokenizedLendingPage";
import RupeeXStablecoinPage from "./components/RupeeXStablecoinPage";
import RupeeXSetup from "./components/RupeeXSetup";
import RupeeXHistoryPage from "./components/RupeeXHistoryPage";

//bank
import BankLoginPage from "./components/BankLoginPage";
import BankDashboard from "./pages/BankDashboard";
//institute
import InstitutionLogin from "./components/InstitutionLogin";
import InstitutionDashboard from "./components/InstitutionDashboard";


// Placeholder components for Cards and Statements
const CardsPage = () => <div className="p-6">Cards Page (Coming Soon)</div>;
const StatementsPage = () => <div className="p-6">Statements Page (Coming Soon)</div>;




// Pages

const AppRoutes = () => (
  <Routes>
    {/* Landing page */}
    <Route path="/" element={<WelcomePage />} />

    {/* Login routes using same Login component but with different loginType prop */}
    <Route path="/login/user" element={<Login loginType="user" />} />

    {/* Signup and OTP */}
    <Route path="/signup" element={<Signup />} />
    <Route path="/verify-otp" element={<OTPVerify />} />

    {/* Dashboard */}
    <Route path="/dashboard" element={<Dashboard />} />

    {/* KYC Routes */}
    <Route path="/kyc/start" element={<KYCStartDecision />} />
    <Route path="/kyc/basic" element={<KYCDetails />} />
    <Route path="/kyc/upload" element={<KYCUpload />} />
    <Route path="/kyc/address" element={<KYCAddress />} />
    <Route path="/kyc/photo" element={<KYCLivePhoto />} />
    <Route path="/kyc/declaration" element={<KYCDeclaration />} />
    <Route path="/kyc/review" element={<KYCReview />} />
<Route path="/kyc/status" element={<KYCStatus />} />
<Route path="/passport-status-page" element={<PassportStatusPage />} />
<Route path="/passport-status-entry" element={<PassportStatusEntry />} />

{/*passport*/}
<Route path="/passport" element={<ReputationPassport />} />
<Route path="/smart-loan" element={<SmartLoanPage />} />
<Route path="/tokenized-lending" element={<TokenizedLendingPage />} />

    {/* Transfer Money */}
<Route path="/transfer-money" element={<TransferMoneyPage />} />

    {/*bank*/}
<Route path="/bank-login" element={<BankLoginPage />} />
<Route path="/bank/dashboard" element={<BankDashboard />} />

  {/*institute*/}
<Route path="/institution/login" element={<InstitutionLogin />} />
<Route path="/institution/dashboard" element={<InstitutionDashboard />} />


    {/* Cards and Statements placeholders */}
    <Route path="/cards" element={<CardsPage />} />
    <Route path="/statements" element={<StatementsPage />} />
<Route path="/rupeex" element={<RupeeXStablecoinPage />} />
<Route path="/rupeex-setup" element={<RupeeXSetup />} />
<Route path="/rupeex/history" element={<RupeeXHistoryPage />} />

    {/* Catch-all: redirect unknown routes to welcome page */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
