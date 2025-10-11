// src/pages/customer/TransactionPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Transaction.css";

export default function TransactionPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState("Credit");
  const [balance, setBalance] = useState(0);
  const [filterAmount, setFilterAmount] = useState("");

  // Fetch accounts of logged-in user
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("https://localhost:7286/api/Account/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(response.data);
        if (response.data.length > 0) {
          setSelectedAccountId(response.data[0].accountId);
          setBalance(response.data[0].balance);
        }
      } catch (err) {
        console.error("Failed to fetch accounts", err);
      }
    };
    fetchAccounts();
  }, [token]);

  // Fetch transactions for the selected account
  useEffect(() => {
    if (!selectedAccountId) return;
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7286/api/Transaction/account/${selectedAccountId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(response.data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchTransactions();
  }, [selectedAccountId, token]);

  const handleAddTransaction = async () => {
    if (!selectedAccountId || !amount) {
      alert("Please select an account and enter amount!");
      return;
    }

    const payload = {
      accountId: selectedAccountId,
      transactionType,
      amount: parseFloat(amount),
      description,
      toAccountId: 0,
      updatedBalance: 0,
      status: "Success",
      transactionDate: new Date().toISOString(),
    };

    try {
      const response = await axios.post("https://localhost:7286/api/Transaction", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newTransaction = response.data;

      // Update transactions & balance dynamically
      setTransactions((prev) => [newTransaction, ...prev]);
      setBalance(newTransaction.updatedBalance || balance);
      alert("Transaction successful!");

      setAmount("");
      setDescription("");
    } catch (err) {
      console.error("Transaction failed", err);
      alert("Transaction failed!");
    }
  };

  return (
    <div className="transaction-container">
      <h2>Transaction History</h2>

      {/* Highlight Current Balance box - displayed first */}
      <p className="balance">Current Balance: ₹{balance.toFixed(2)}</p>

      {/* Account Selection */}
      <div className="account-select">
        <label>Select Account:</label>
        <select
          value={selectedAccountId}
          onChange={(e) => {
            const accId = e.target.value;
            setSelectedAccountId(accId);
            const acc = accounts.find((a) => a.accountId === parseInt(accId));
            setBalance(acc ? acc.balance : 0);
          }}
        >
          {accounts.length > 0 ? (
            accounts.map((acc) => (
              <option key={acc.accountId} value={acc.accountId}>
                {acc.accountType} - {acc.accountId}
              </option>
            ))
          ) : (
            <option>No accounts found</option>
          )}
        </select>
      </div>

      {/* Transaction Form */}
      <div className="transaction-form">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="Credit">Credit</option>
          <option value="Debit">Debit</option>
        </select>
        <button onClick={handleAddTransaction}>Add</button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <label>Filter by amount ≥</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
        />
      </div>

      {/* Transactions Table */}
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Type</th>
            <th>Amount (₹)</th>
            <th>Description</th>
            <th>Balance Remaining (₹)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions
              .filter((t) => !filterAmount || t.amount >= filterAmount)
              .map((t) => (
                <tr key={t.transactionId}>
                  <td>{new Date(t.transactionDate).toLocaleString()}</td>
                  <td>{t.transactionType}</td>
                  <td>{t.amount}</td>
                  <td>{t.description}</td>
                  <td>{t.updatedBalance}</td>
                  <td>{t.status}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="6">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
