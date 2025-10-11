// src/pages/AccountDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AccountDetails() {
  const { token, user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: user.customerId || 0,
    accountNumber: "",
    accountType: "",
    branchName: "",
    ifscCode: "",
    balance: 0,
    status: "Active",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!token) return;

      try {
        const response = await axios.get("https://localhost:7286/api/Account/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(response.data || []);
        setError("");
      } catch (err) {
        console.error("Unable to fetch accounts:", err);
        if (err.response && err.response.status === 404) {
          setAccounts([]);
          setError("");
        } else {
          setError("Failed to fetch account details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(
        "https://localhost:7286/api/Account",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccounts([...accounts, response.data]);
      setShowForm(false);
      setMessage("Account created successfully!");
      setFormData({
        ...formData,
        accountNumber: "",
        accountType: "",
        branchName: "",
        ifscCode: "",
        balance: 0,
        status: "Active",
      });
    } catch (err) {
      console.error(err);
      setMessage("Failed to create account. Please try again.");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading account details...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{error}</p>;

  return (
    <div
      style={{
        padding: "20px",
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        backgroundColor: "#D0E7FF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#052152ff", marginBottom: "20px" }}>
        My Account Details
      </h2>

      {/* Create Account Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            marginBottom: "20px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Create New Account
        </button>
      )}

      {/* Account Table */}
      {accounts.length > 0 ? (
        <div style={{ width: "100%", flex: 1, overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="8"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "center",
              fontSize: "16px",
              minWidth: "900px",
            }}
          >
            <thead style={{ backgroundColor: "#a2c0ddff", color: "#fff" }}>
              <tr>
                <th>Account ID</th>
                <th>Account Number</th>
                <th>Account Type</th>
                <th>Branch Name</th>
                <th>IFSC Code</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "#eff3f0ff" }}>
              {accounts.map((acc) => (
                <tr key={acc.accountId}>
                  <td>{acc.accountId}</td>
                  <td>{acc.accountNumber}</td>
                  <td>{acc.accountType}</td>
                  <td>{acc.branchName}</td>
                  <td>{acc.ifscCode}</td>
                  <td>{acc.balance}</td>
                  <td>{acc.status}</td>
                  <td>{new Date(acc.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ marginTop: "20px" }}>No accounts yet. You can create one above.</p>
      )}

      {/* Account Creation Form */}
      {showForm && (
        <form
          onSubmit={handleCreateAccount}
          style={{
            marginTop: "30px",
            marginBottom: "70px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "400px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Uniform visible input styles */}
          <input
            type="text"
            name="accountNumber"
            placeholder="Account Number"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            style={{
              backgroundColor: "#f9f9f9",
              color: "#000",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />

          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            required
            style={{
              backgroundColor: "#f9f9f9",
              color: "#000",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          >
            <option value="" disabled>
              Select Account Type
            </option>
            <option value="Savings">Savings</option>
            <option value="Salary">Salary</option>
            <option value="Joint">Joint</option>
          </select>

          <input
            type="text"
            name="branchName"
            placeholder="Branch Name"
            value={formData.branchName}
            onChange={handleChange}
            required
            style={{
              backgroundColor: "#f9f9f9",
              color: "#000",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />

          <input
            type="text"
            name="ifscCode"
            placeholder="IFSC Code"
            value={formData.ifscCode}
            onChange={handleChange}
            required
            style={{
              backgroundColor: "#f9f9f9",
              color: "#000",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />

          <input
            type="number"
            name="balance"
            placeholder="Initial Balance"
            value={formData.balance}
            onChange={handleChange}
            required
            style={{
              backgroundColor: "#f9f9f9",
              color: "#000",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              backgroundColor: "#f9f9f9",
              color: "#000",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="submit"
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "15px",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#059862")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "green")}
          >
            Submit
          </button>

          {message && (
            <p style={{ color: "#0dc51cff", marginTop: "10px", textAlign: "center" }}>{message}</p>
          )}
        </form>
      )}
    </div>
  );
}
