// src/pages/ApplyLoan.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function ApplyLoan() {
  const { token } = useAuth();
  const [customerId, setCustomerId] = useState("");
  const [loanProductId, setLoanProductId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loanProducts, setLoanProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch loan products
  useEffect(() => {
    const fetchLoanProducts = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7286/api/LoanProduct",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLoanProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch loan products:", err);
        setMessage("Failed to fetch loan products.");
      }
    };
    fetchLoanProducts();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId || !loanProductId || !loanAmount || !purpose) {
      alert("Please fill all fields.");
      return;
    }

    const payload = {
      CustomerId: parseInt(customerId),
      LoanProductId: parseInt(loanProductId),
      AmountRequested: parseFloat(loanAmount),
      Purpose: purpose.trim(),
    };

    try {
      setSubmitting(true);
      await axios.post(
        "https://localhost:7286/api/LoanApplication",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Loan application submitted successfully!");
      setCustomerId("");
      setLoanProductId("");
      setLoanAmount("");
      setPurpose("");
    } catch (err) {
      console.error("Loan application failed:", err.response || err);
      setMessage(
        "Failed to submit loan application: " +
          (err.response?.data?.title || err.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#D0E7FF",
        padding: "60px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* Header above the form */}
      <h1
        style={{
          color: "#0B3D91",
          marginBottom: "30px",
          fontSize: "2.5rem",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        Apply for a Loan
      </h1>

      {/* Form Box */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          minWidth: "600px",
          maxWidth: "700px",
          width: "100%",
          backgroundColor: "#fff",
          padding: "50px",
          borderRadius: "15px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          fontSize: "1.1rem",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", fontSize: "1.1rem" }}>
          Customer ID:
          <input
            type="number"
            placeholder="Enter your customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            style={{
              padding: "14px",
              borderRadius: "8px",
              marginTop: "5px",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "1.1rem",
              border: "2px solid black", // Black border
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", fontSize: "1.1rem" }}>
          Loan Product:
          <select
            value={loanProductId}
            onChange={(e) => setLoanProductId(e.target.value)}
            required
            style={{
              padding: "14px",
              borderRadius: "8px",
              marginTop: "5px",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "1.1rem",
              border: "2px solid black", // Black border
            }}
          >
            <option value="">Select a product</option>
            {loanProducts.map((lp) => (
              <option key={lp.loanProductId} value={lp.loanProductId}>
                {lp.name} - {lp.interestRate}%
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", fontSize: "1.1rem" }}>
          Loan Amount (₹):
          <input
            type="number"
            placeholder="Enter loan amount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            required
            min="1000"
            style={{
              padding: "14px",
              borderRadius: "8px",
              marginTop: "5px",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "1.1rem",
              border: "2px solid black", // Black border
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", fontSize: "1.1rem" }}>
          Purpose:
          <input
            type="text"
            placeholder="Enter purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            style={{
              padding: "14px",
              borderRadius: "8px",
              marginTop: "5px",
              backgroundColor: "#fff",
              color: "#000",
              fontSize: "1.1rem",
              border: "2px solid black", // Black border
            }}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "16px",
            borderRadius: "10px",
            backgroundColor: "#057c48ff",
            color: "white",
            fontWeight: "600",
            fontSize: "1.2rem",
            cursor: submitting ? "not-allowed" : "pointer",
            border: "none",
          }}
        >
          {submitting ? "Submitting..." : "Apply"}
        </button>

        {message && (
          <p
            style={{
              color: message.includes("Failed") ? "red" : "green",
              marginTop: "10px",
              textAlign: "center",
              fontWeight: "500",
              fontSize: "1.1rem",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
