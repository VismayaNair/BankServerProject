// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import "./App.css"; // Global styles first
import "./styles/AppTheme.css";

// Customer Pages
import Home from "./pages/Home";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import AccountDetails from "./pages/customer/AccountDetails";
import ApplyLoan from "./pages/customer/ApplyLoan";
import ReviewApplication from "./pages/customer/ReviewApplication";
import LoanRepayment from "./pages/customer/LoanRepayment";
import TransactionHistory from "./pages/customer/TransactionHistory";
import LoanProducts from "./pages/customer/LoanProducts";
import Register from "./pages/Register"; // Add the Register page

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CustomersPage from "./pages/admin/Customerspage";
import AccountsPage from "./pages/admin/Accountspage";
import LoanProductsPage from "./pages/admin/LoanProductsPage";
import LoanApplicationsPage from "./pages/admin/LoanApplicationsPage";
import LoanRepaymentsPage from "./pages/admin/LoanRepaymentsPage";
import TransactionsPage from "./pages/admin/TransactionsPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} /> {/* Register route */}

        {/* Customer Routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute role="User">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/account"
          element={
            <ProtectedRoute role="User">
              <AccountDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/apply-loan"
          element={
            <ProtectedRoute role="User">
              <ApplyLoan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/loan-status"
          element={
            <ProtectedRoute role="User">
              <ReviewApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/repayment"
          element={
            <ProtectedRoute role="User">
              <LoanRepayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/transactions"
          element={
            <ProtectedRoute role="User">
              <TransactionHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/products"
          element={
            <ProtectedRoute role="User">
              <LoanProducts />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested Admin Routes */}
          <Route path="customers" element={<CustomersPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="loan-products" element={<LoanProductsPage />} />
          <Route path="loan-applications" element={<LoanApplicationsPage />} />
          <Route path="loan-repayments" element={<LoanRepaymentsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
