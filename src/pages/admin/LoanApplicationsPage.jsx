// src/pages/admin/LoanApplicationsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Components.css"; // Import button styles

export default function LoanApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "https://localhost:7286/api/LoanApplication";

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching loan applications:", err);
      setError("Failed to load loan applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const app = applications.find((a) => a.applicationId === id);
      const updatedApp = { ...app, status };
      await axios.put(`${API_URL}/${id}`, updatedApp, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplications();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplications();
    } catch (err) {
      console.error("Error deleting application:", err);
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.customerId.toString().includes(searchTerm) ||
      app.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <div style={{ padding: "20px" }}>Loading...</div>;
  if (error)
    return <div style={{ padding: "20px" }}>{error}</div>;
  if (!applications.length)
    return <div style={{ padding: "20px" }}>No loan applications found.</div>;

  return (
    <div
      style={{
        minHeight: "100vh",      // full viewport height
        width: "100vw",           // full viewport width
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // start from top
        alignItems: "center",
        backgroundColor: "#D0E7FF",
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",        // scroll if content exceeds viewport
      }}
    >
      <h2 style={{ color: "#0B3D91", marginBottom: "20px" }}>Loan Applications</h2>

      <div style={{ marginBottom: "15px", display: "flex", gap: "5px" }}>
        <input
          type="text"
          placeholder="Search by Customer ID or Purpose"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <table border="1" cellPadding="5" cellSpacing="0" style={{ minWidth: "700px" }}>
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Customer ID</th>
              <th>Loan Product ID</th>
              <th>Purpose</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.applicationId}>
                <td>{app.applicationId}</td>
                <td>{app.customerId}</td>
                <td>{app.loanProductId}</td>
                <td>{app.purpose}</td>
                <td>{app.status}</td>
                <td>
                  {app.status.toLowerCase() === "pending" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(app.applicationId, "Approved")}
                        className="button button-approve"
                        style={{ marginRight: "5px" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.applicationId, "Rejected")}
                        className="button button-reject"
                        style={{ marginRight: "5px" }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(app.applicationId)}
                    className="button button-reject"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredApplications.length === 0 && (
        <div style={{ marginTop: "10px" }}>No applications found for your search.</div>
      )}
    </div>
  );
}
