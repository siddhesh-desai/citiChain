import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  BanknotesIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out");
    navigate("/login"); // redirect to login page or welcome screen
  };

  const activeClass =
    "flex items-center space-x-3 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold";
  const inactiveClass =
    "flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-indigo-100 text-indigo-700 font-semibold";

  return (
    <aside className="w-full md:w-64 bg-white shadow-md p-6 flex flex-col">
      <div className="flex items-center mb-8 space-x-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Citi.svg/1200px-Citi.svg.png"
          alt="CitiChain Logo"
          className="w-14 h-14 object-contain"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{userName}</h2>
          <p className="text-sm text-gray-500">Premium Account</p>
        </div>
      </div>

      <nav className="flex flex-col space-y-3 flex-grow">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          <BanknotesIcon className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/kyc/start"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          <DocumentCheckIcon className="w-5 h-5" />
          <span>KYC</span>
        </NavLink>

     {/* Fix here: changed route to match AppRoutes */}
<NavLink
  to="/transfer-money"
  className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
>
  <ArrowUpTrayIcon className="w-5 h-5" />
  <span>Transfer Money</span>
</NavLink>


        <NavLink
          to="/cards"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          <CreditCardIcon className="w-5 h-5" />
          <span>Cards</span>
        </NavLink>

        <NavLink
          to="/statements"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          <DocumentDuplicateIcon className="w-5 h-5" />
          <span>Statements</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 text-red-600 font-semibold"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
