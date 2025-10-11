import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ReviewApplications.css";

export default function ReviewApplications() {
  const { token } = useAuth();
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7286/api/LoanApplication/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllApplications(response.data);
      setFilteredApplications(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching loan applications:", err);
      setError("Failed to load your loan applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSearch = () => {
    if (!searchId) {
      applyFilters(allApplications, statusFilter);
      return;
    }
    const searched = allApplications.filter(
      (app) => app.applicationId.toString() === searchId
    );
    if (searched.length === 0) {
      setFilteredApplications([]);
      setError("No application found with this ID.");
    } else {
      setFilteredApplications(searched);
      setError("");
    }
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    applyFilters(allApplications, value);
  };

  const applyFilters = (applications, status) => {
    let filtered = [...applications];
    if (status) {
      filtered = filtered.filter(
        (app) => app.status.toLowerCase() === status.toLowerCase()
      );
    }
    setFilteredApplications(filtered);
    setError("");
  };

  if (loading) return <p>Loading your loan applications...</p>;
  if (error && filteredApplications.length === 0)
    return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="review-applications-container">
      <h1>Your Loan Applications</h1>

      {/* Filters */}
      <div className="review-applications-filters">
        <input
          type="text"
          placeholder="Search by Application ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
        <button onClick={fetchApplications} className="reset-btn">
          Reset
        </button>
        <select value={statusFilter} onChange={handleStatusFilter}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="review-applications-grid">
          {filteredApplications.map((app) => (
            <div key={app.applicationId} className="application-card">
              <h2>Application #{app.applicationId}</h2>
              <p>
                <strong>Loan Product ID:</strong> {app.loanProductId}
              </p>
              <p>
                <strong>Amount Requested:</strong> ₹{app.amountRequested}
              </p>
              <p>
                <strong>Interest Rate:</strong> {app.interestRate}%
              </p>
              <p>
                <strong>Tenure:</strong> {app.tenureMonths} months
              </p>
              <p>
                <strong>Purpose:</strong> {app.purpose}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    app.status === "Pending"
                      ? "status-pending"
                      : app.status === "Approved"
                      ? "status-approved"
                      : "status-rejected"
                  }
                >
                  {app.status}
                </span>
              </p>
              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(app.applicationDate).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
