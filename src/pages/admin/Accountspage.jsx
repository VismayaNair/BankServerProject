// src/pages/AccountsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import { getAllAccounts, getAccountById, updateAccount, deleteAccount } from "../../api/account";
import { useAuth } from "../../context/AuthContext";
import "../../styles/AccountManagement.css";

export default function AccountsPage() {
  const { token } = useAuth();
  const navigate = useNavigate(); // initialize navigate
  const [accounts, setAccounts] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountId: "",
    customerId: "",
    accountNumber: "",
    accountType: "",
    branchName: "",
    ifscCode: "",
    balance: "",
    status: "",
  });

  const fetchAccounts = async () => {
    try {
      const data = await getAllAccounts(token);
      setAccounts(data);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
      alert("Failed to fetch accounts");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSearch = async () => {
    if (!searchId) {
      fetchAccounts();
      return;
    }
    try {
      const data = await getAccountById(searchId, token);
      setAccounts([data]);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Account not found");
      setAccounts([]);
    }
  };

  const handleReset = () => {
    setSearchId("");
    fetchAccounts();
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      await deleteAccount(accountId, token);
      alert("Account deleted successfully");
      fetchAccounts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete account");
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account.accountId);
    setFormData({ ...account });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedAccount) return;

    try {
      await updateAccount(selectedAccount, formData, token);
      alert("Account updated successfully");
      setSelectedAccount(null);
      fetchAccounts();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update account");
    }
  };

  return (
    <div className="accounts-page">
      {/* Home Button */}
      <div className="home-button-container" style={{ marginBottom: "1rem" }}>
        <button
          className="button-secondary"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>

      <h2 className="accounts-header">Accounts Management</h2>

      {/* Search */}
      <div className="center-button-container">
        <input
          type="number"
          placeholder="Enter Account ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch} className="button-apply">
          Search
        </button>
        <button onClick={handleReset} className="button-secondary">
          Reset
        </button>
      </div>

      {/* Accounts Table */}
      <div className="table-container">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer ID</th>
              <th>Account Number</th>
              <th>Type</th>
              <th>Branch</th>
              <th>IFSC</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.accountId}>
                <td>{acc.accountId}</td>
                <td>{acc.customerId}</td>
                <td>{acc.accountNumber}</td>
                <td>{acc.accountType}</td>
                <td>{acc.branchName}</td>
                <td>{acc.ifscCode}</td>
                <td>{acc.balance}</td>
                <td>{acc.status}</td>
                <td>{new Date(acc.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(acc)} className="button-update">
                    Update
                  </button>
                  <button onClick={() => handleDelete(acc.accountId)} className="button-reject">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Form */}
      {selectedAccount && (
        <form onSubmit={handleUpdate} className="update-form">
          <h3>Update Account ID: {selectedAccount}</h3>
          <label>Customer ID:</label>
          <input type="number" name="customerId" value={formData.customerId} onChange={handleChange} required />
          <label>Account Number:</label>
          <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required />
          <label>Account Type:</label>
          <input type="text" name="accountType" value={formData.accountType} onChange={handleChange} required />
          <label>Branch Name:</label>
          <input type="text" name="branchName" value={formData.branchName} onChange={handleChange} required />
          <label>IFSC Code:</label>
          <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} required />
          <label>Balance:</label>
          <input type="number" name="balance" value={formData.balance} onChange={handleChange} required />
          <label>Status:</label>
          <input type="text" name="status" value={formData.status} onChange={handleChange} required />
          <div className="form-buttons">
            <button type="submit" className="button-apply">Save Changes</button>
            <button type="button" className="button-secondary" onClick={() => setSelectedAccount(null)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
