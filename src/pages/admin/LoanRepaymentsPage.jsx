// src/pages/admin/AdminLoanRepayments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Components.css"; // reusable button/input styles

const API_REPAYMENTS = "https://localhost:7286/api/LoanRepayment";
const API_LOANS = "https://localhost:7286/api/LoanApplication";

export default function AdminLoanRepayments() {
  const [repayments, setRepayments] = useState([]);
  const [loans, setLoans] = useState({});
  const [filterLoanId, setFilterLoanId] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch repayments and loans
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const repaymentRes = await axios.get(API_REPAYMENTS, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const loanRes = await axios.get(API_LOANS, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const loanMap = {};
        loanRes.data.forEach((loan) => {
          loanMap[loan.applicationId] = loan;
        });

        setRepayments(repaymentRes.data);
        setLoans(loanMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (loanId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const loan = loans[loanId];
      if (!loan) return;

      await axios.put(
        `${API_LOANS}/${loanId}`,
        { ...loan, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLoans((prev) => ({
        ...prev,
        [loanId]: { ...prev[loanId], status: newStatus },
      }));
      alert(`Loan ${loanId} status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const filteredRepayments = filterLoanId
    ? repayments.filter((r) => r.loanApplicationId.toString() === filterLoanId)
    : repayments;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#cbdffeff", // dark blue background
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        All Loan Repayments
      </h1>

      {/* Filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Filter by Loan ID"
          value={filterLoanId}
          onChange={(e) => setFilterLoanId(e.target.value)}
          className="input"
          style={{ flex: 1, padding: "0.5rem", borderRadius: "5px" }}
        />
        <button
          className="button button-approve"
          onClick={() => setFilterLoanId("")}
          style={{ backgroundColor: "#28a745", color: "#fff" }}
        >
          Reset
        </button>
      </div>

      {/* Table container */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
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
              backgroundColor: "#8ba2c4ff",
              color: "#fff",
            }}
          >
            <tr>
              <th style={{ padding: "10px", border: "1px solid #fff" }}>
                Loan ID
              </th>
              <th style={{ padding: "10px", border: "1px solid #fff" }}>
                Customer ID
              </th>
              <th style={{ padding: "10px", border: "1px solid #fff" }}>
                Amount Paid (₹)
              </th>
              <th style={{ padding: "10px", border: "1px solid #fff" }}>
                Balance Remaining (₹)
              </th>
              <th style={{ padding: "10px", border: "1px solid #fff" }}>
                Total Payable (₹)
              </th>
              <th style={{ padding: "10px", border: "1px solid #fff" }}>
                Payment Date
              </th>
              <th style={{ padding: "10px", border: "1px solid #fff" }}>
                Status
              </th>
              <th style={{ padding: "10px", border: "1px solid #fff" }}>
                Application Status
              </th>
              <th style={{ padding: "10px", border: "1px solid #fff" }}>
                Change Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRepayments.map((r) => {
              const loan = loans[r.loanApplicationId] || {};
              return (
                <tr
                  key={r.repaymentId}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                  }}
                >
                  <td style={{ padding: "8px" }}>{r.loanApplicationId}</td>
                  <td style={{ padding: "8px" }}>{loan.customerId || "N/A"}</td>
                  <td style={{ padding: "8px" }}>₹{r.amountPaid.toFixed(2)}</td>
                  <td style={{ padding: "8px" }}>
                    ₹{r.balanceRemaining?.toFixed(2) || "N/A"}
                  </td>
                  <td style={{ padding: "8px" }}>
                    ₹{r.totalPayable?.toFixed(2) || "N/A"}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {new Date(r.paymentDate).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px" }}>{r.status}</td>
                  <td style={{ padding: "8px" }}>{loan.status || "N/A"}</td>
                  <td style={{ padding: "8px" }}>
                    {loan.status === "Pending" ? (
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="button button-approve"
                          onClick={() =>
                            handleStatusChange(r.loanApplicationId, "Approved")
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="button button-reject"
                          onClick={() =>
                            handleStatusChange(r.loanApplicationId, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
