import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./../styles/CustomerDashboard.css";
import profileIcon from "../assets/profile-icon.jpg";

export default function CustomerDashboard() {
  const { token, user } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: user.userId,
    aadharNumber: "",
    panNumber: "",
    dateOfBirth: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Masking functions
  const maskAadhar = (aadhar) => (aadhar ? aadhar.replace(/\d(?=\d{4})/g, "X") : "");
  const maskPAN = (pan) => (pan ? pan.replace(/^.{0,5}/, "XXXXX") : "");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get("https://localhost:7286/api/Customer/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(response.data);
      } catch (err) {
        console.error("Error fetching customer details:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else if (err.response?.status === 404) {
          // No customer profile exists
          setCustomer(null);
        } else {
          setError("Unable to load your profile details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7286/api/Customer",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Customer profile created successfully!");
      setCustomer(response.data); // set newly created customer
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create profile. Please try again.");
    }
  };

  if (loading) return <p className="customer-dashboard-loading">Loading your details...</p>;
  if (error) return <p className="customer-dashboard-error">{error}</p>;

  return (
    <div className="customer-dashboard-container">
      {/* Header */}
      <div className="customer-dashboard-header">
        <h1>Welcome, {user?.username || "Customer"} 👋</h1>
        <span className="welcome-msg">Your dashboard at a glance</span>
      </div>

      {!customer ? (
        <div className="new-customer-profile">
          <p>Your User ID: <strong>{user.userId}</strong></p>
          {!showForm ? (
            <button onClick={() => setShowForm(true)}>Create Profile</button>
          ) : (
            <form onSubmit={handleCreateProfile} className="customer-create-form">
              <input
                type="text"
                name="aadharNumber"
                placeholder="Aadhar Number"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
                className="register-input"
              />
              <input
                type="text"
                name="panNumber"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChange={handleChange}
                required
                className="register-input"
              />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="register-input"
              />
              <button type="submit" className="register-button">Submit Profile</button>
            </form>
          )}
          {message && <p className="message">{message}</p>}
        </div>
      ) : (
        <>
          {/* Profile Card */}
          <div className="customer-dashboard-card profile-card">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <div className="customer-details">
              <p><strong>Customer ID:</strong> {customer.customerId}</p>
              <p><strong>User ID:</strong> {customer.userId}</p>
              <p><strong>Aadhar Number:</strong> {maskAadhar(customer.aadharNumber)}</p>
              <p><strong>PAN Number:</strong> {maskPAN(customer.panNumber)}</p>
              <p><strong>Date of Birth:</strong> {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="customer-dashboard-cards">
            {[
              { label: "Account Details", path: "/customer/account" },
              { label: "Apply for Loan", path: "/customer/apply-loan" },
              { label: "Review Application", path: "/customer/loan-status" },
              { label: "Loan Repayment", path: "/customer/repayment" },
              { label: "Transactions", path: "/customer/transactions" },
              { label: "View Loan Products", path: "/customer/products" },
            ].map((btn) => (
              <button
                key={btn.label}
                className="customer-dashboard-button customer-dashboard-button-primary"
                onClick={() => navigate(btn.path)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
