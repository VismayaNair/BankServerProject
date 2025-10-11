// src/pages/customer/TransactionsPage.jsx
import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../../api/transactions";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/Components.css"; // reusable button/input styles

export default function TransactionsPage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filterAccountId, setFilterAccountId] = useState("");
  const [filterAmount, setFilterAmount] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions(token);
        const sorted = data.sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        );
        setTransactions(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, [token]);

  const filtered = transactions.filter((t) => {
    return (
      (filterAccountId ? t.accountId === parseInt(filterAccountId) : true) &&
      (filterAmount ? t.amount >= parseFloat(filterAmount) : true)
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#D0E7FF", // pastel blue background
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          color: "#0B3D91",
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        All Transactions
      </h1>

      {/* Filter Inputs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="number"
          placeholder="Filter by Account ID"
          value={filterAccountId}
          onChange={(e) => setFilterAccountId(e.target.value)}
          className="input"
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            border: "1px solid #001F3F",
          }}
        />
        <input
          type="number"
          placeholder="Filter by Amount ≥"
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
          className="input"
          style={{
            flex: 1,
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            border: "1px solid #001F3F",
          }}
        />
        <button
          className="button-secondary"
          onClick={() => {
            setFilterAccountId("");
            setFilterAmount("");
          }}
          style={{ minWidth: "100px" }}
        >
          Reset
        </button>
      </div>

      {/* Table container */}
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          width: "100%",
          borderRadius: "10px",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "900px",
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#a3b5c7", // light blue header
              color: "#001F3F",
            }}
          >
            <tr>
              <th style={{ padding: "10px", border: "1px solid #4e5761" }}>
                Transaction ID
              </th>
              <th style={{ padding: "10px", border: "1px solid #4e5761" }}>
                Account ID
              </th>
              <th style={{ padding: "10px", border: "1px solid #4e5761" }}>
                Type
              </th>
              <th style={{ padding: "10px", border: "1px solid #4e5761" }}>
                Amount (₹)
              </th>
              <th style={{ padding: "10px", border: "1px solid #4e5761" }}>
                Description
              </th>
              <th style={{ padding: "10px", border: "1px solid #4e5761" }}>
                Balance Remaining (₹)
              </th>
              <th style={{ padding: "10px", border: "1px solid #4e5761" }}>
                Date & Time
              </th>
              <th style={{ padding: "10px", border: "1px solid #4e5761" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr
                key={t.transactionId}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <td style={{ padding: "8px" }}>{t.transactionId}</td>
                <td style={{ padding: "8px" }}>{t.accountId}</td>
                <td style={{ padding: "8px" }}>{t.transactionType}</td>
                <td style={{ padding: "8px" }}>₹{t.amount.toFixed(2)}</td>
                <td style={{ padding: "8px" }}>{t.description}</td>
                <td style={{ padding: "8px" }}>
                  ₹{t.updatedBalance?.toFixed(2) ?? "-"}
                </td>
                <td style={{ padding: "8px" }}>
                  {new Date(t.transactionDate).toLocaleString()}
                </td>
                <td style={{ padding: "8px" }}>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
