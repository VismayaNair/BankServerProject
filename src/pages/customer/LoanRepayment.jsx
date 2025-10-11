// src/pages/customer/LoanRepayment.jsx
import React, { useState } from "react";
import axios from "axios";
import { getMyLoans } from "../../api/loanApplications";
import { createRepayment } from "../../api/loanRepayments";
import { useAuth } from "../../hooks/useAuth";

export default function LoanRepayment() {
  const { token } = useAuth();
  const [loanIdInput, setLoanIdInput] = useState("");
  const [loanDetails, setLoanDetails] = useState(null);
  const [amountPaid, setAmountPaid] = useState("");
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch loan details by ID
  const fetchLoanById = async (id) => {
    try {
      const loans = await getMyLoans(token);
      const loan = loans.find(
        (l) => l.applicationId === Number(id) || l.loanApplicationId === Number(id)
      );

      if (!loan) {
        setLoanDetails(null);
        setMessage("Loan not found");
        return;
      }

      if (loan.balanceRemaining <= 0) {
        setLoanDetails(null);
        setMessage("Loan is fully paid");
        return;
      }

      // Fetch all repayments for that loan
      const repaymentsRes = await axios.get(
        `https://localhost:7286/api/LoanRepayment/loan/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoanDetails(loan);
      setRepayments(repaymentsRes.data || []);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching loan or repayments");
    }
  };

  const handleFetchLoan = (e) => {
    e.preventDefault();
    if (!loanIdInput) {
      setMessage("Enter a loan application ID");
      return;
    }
    fetchLoanById(loanIdInput);
  };

  const handleRepaymentSubmit = async (e) => {
    e.preventDefault();
    if (!amountPaid || Number(amountPaid) <= 0) {
      setMessage("Enter a valid repayment amount");
      return;
    }
    if (!loanDetails) {
      setMessage("No loan selected");
      return;
    }

    try {
      setLoading(true);

      const data = {
        loanApplicationId: loanDetails.applicationId ?? loanDetails.loanApplicationId,
        amountPaid: Number(amountPaid),
      };

      const res = await createRepayment(data, token);

      // Normalize backend response for table
      const newRepayment = {
        repaymentId: res.repaymentId || res.RepaymentId,
        loanPurpose: loanDetails.purpose,
        amountPaid: data.amountPaid,
        balanceRemaining: res.balanceRemaining || res.BalanceRemaining,
        paymentDate: new Date().toISOString(),
        status: res.status || res.Status || loanDetails.status,
      };

      // Update repayments table
      setRepayments((prev) => [...prev, newRepayment]);

      // Update loan balance locally
      const updatedLoan = {
        ...loanDetails,
        balanceRemaining: newRepayment.balanceRemaining,
        status: newRepayment.status,
      };

      setLoanDetails(updatedLoan);

      if (updatedLoan.balanceRemaining <= 0) {
        setMessage("🎉 Loan fully repaid!");
      } else {
        setMessage(res.message || res.Message || "Repayment successful");
      }

      setAmountPaid("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data || "Error making repayment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#c7dff8ff",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#0B3D91", marginBottom: "30px", fontSize: "32px" }}>
        Loan Repayment
      </h2>

      {message && (
        <p
          style={{
            color: message.includes("Error") ? "red" : "green",
            marginBottom: "20px",
          }}
        >
          {message}
        </p>
      )}

      {/* Loan ID Input */}
      <form
        onSubmit={handleFetchLoan}
        style={{ marginBottom: "20px", width: "100%", maxWidth: "400px" }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
            color: "black",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Enter Loan Application ID:
          <input
            type="number"
            placeholder="Loan Application ID"
            value={loanIdInput}
            onChange={(e) => setLoanIdInput(e.target.value)}
            style={{
              padding: "14px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "2px solid black",
              fontSize: "16px",
            }}
            required
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            backgroundColor: "#2eb55bff",
            color: "#fff",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          Fetch Loan
        </button>
      </form>

      {/* Loan Details */}
      {loanDetails && (
        <div
          style={{
            marginBottom: "20px",
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <p>
            <strong>Loan Purpose:</strong> {loanDetails.purpose}
          </p>
          <p>
            <strong>Amount Requested:</strong> ₹{loanDetails.amountRequested}
          </p>
          <p>
            <strong>Interest Rate:</strong> {loanDetails.interestRate}%
          </p>
          <p>
            <strong>Tenure:</strong> {loanDetails.tenureMonths} months
          </p>
          <p>
            <strong>Total Payable Amount:</strong> ₹
            {loanDetails.amountRequested +
              (loanDetails.amountRequested * loanDetails.interestRate) / 100}
          </p>
          <p>
            <strong>Balance Remaining:</strong> ₹{loanDetails.balanceRemaining}
          </p>
          <p>
            <strong>Status:</strong> {loanDetails.status}
          </p>
        </div>
      )}

      {/* Repayment Form */}
      {loanDetails && (
        <form
          onSubmit={handleRepaymentSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "400px",
            marginBottom: "30px",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              color: "black",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Repayment Amount:
            <input
              type="number"
              min="1"
              placeholder="Enter amount"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              style={{
                padding: "14px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "2px solid black",
                fontSize: "16px",
              }}
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              backgroundColor: "#139d5cff",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Processing..." : "Make Repayment"}
          </button>
        </form>
      )}

      {/* Repayments Table */}
      <div style={{ width: "100%", overflowX: "auto", maxWidth: "1000px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "700px",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#759de3ff", color: "#fff" }}>
            <tr>
              <th style={{ padding: "10px" }}>Repayment ID</th>
              <th>Loan Purpose</th>
              <th>Amount Paid (₹)</th>
              <th>Balance Remaining (₹)</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {repayments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "10px" }}>
                  No repayments yet
                </td>
              </tr>
            ) : (
              repayments.map((r) => (
                <tr key={r.repaymentId} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ padding: "8px" }}>{r.repaymentId}</td>
                  <td>{r.loanPurpose}</td>
                  <td>₹{r.amountPaid}</td>
                  <td>₹{r.balanceRemaining}</td>
                  <td>
                    {new Date(r.paymentDate || r.PaymentDate).toLocaleString()}
                  </td>
                  <td>{r.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
