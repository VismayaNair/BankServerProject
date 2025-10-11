// AdminDashboard.jsx
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const location = useLocation();

  const isDashboardRoot = location.pathname === "/admin/dashboard";

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-heading">Admin Panel</h2>
        <ul className="sidebar-list">
          <li><Link to="customers">Customer Details</Link></li>
          <li><Link to="accounts">Account Details</Link></li>
          <li><Link to="loan-products">Loan Products</Link></li>
          <li><Link to="loan-applications">Loan Applications</Link></li>
          <li><Link to="loan-repayments">Loan Repayments</Link></li>
          <li><Link to="transactions">Transactions</Link></li>
        </ul>
      </aside>

      <main className="dashboard-main">
        {isDashboardRoot && (
          <div className="welcome-message full-screen-center">
            Welcome, Admin
          </div>
        )}

        {/* Nested routes */}
        <Outlet />
      </main>
    </div>
  );
}
