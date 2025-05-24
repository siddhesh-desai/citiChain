import { useState } from "react";
import AdminTransactions from "./AdminTransactions";
import AdminLoans from "./AdminLoans";
import AdminInstitutions from "./AdminInstitutions";
import AdminConsentLogs from "./AdminConsentLogs";

const AdminDashboard = () => {
  const [page, setPage] = useState("transactions");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏦 Bank Admin Dashboard</h2>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setPage("transactions")}>Show Transactions</button>
        <button onClick={() => setPage("loans")}>Loan & EMI Control</button>
        <button onClick={() => setPage("institutions")}>Institution Management</button>
        <button onClick={() => setPage("consent")}>Consent & Access Logs</button>
      </div>

      {/* Conditional Render */}
      {page === "transactions" && <AdminTransactions />}
      {page === "loans" && <AdminLoans />}
      {page === "institutions" && <AdminInstitutions />}
      {page === "consent" && <AdminConsentLogs />}
    </div>
  );
};

export default AdminDashboard;
