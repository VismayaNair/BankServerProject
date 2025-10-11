// src/pages/admin/CustomersPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../../api/customer";
import "../../styles/CustomerManagement.css"; // Updated CSS for full screen

export default function CustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({
    AadharNumber: "",
    PANNumber: "",
    DateOfBirth: "",
  });

  const fetchAllCustomers = async () => {
    try {
      const data = await getAllCustomers(token);
      setCustomers(data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      alert("Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const handleSearch = async () => {
    if (!searchId) return fetchAllCustomers();
    try {
      const data = await getCustomerById(searchId, token);
      setCustomers([data]);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Customer not found");
    }
  };

  const handleReset = () => {
    setSearchId("");
    fetchAllCustomers();
  };

  const handleEditClick = (customer) => {
    setEditingId(customer.customerId);
    setEditFields({
      AadharNumber: customer.aadharNumber,
      PANNumber: customer.panNumber,
      DateOfBirth: customer.dateOfBirth.slice(0, 10),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFields({ AadharNumber: "", PANNumber: "", DateOfBirth: "" });
  };

  const handleSaveEdit = async (customer) => {
    try {
      const updatedData = {
        AadharNumber: editFields.AadharNumber,
        PANNumber: editFields.PANNumber,
        DateOfBirth: editFields.DateOfBirth,
        UserId: customer.userId,
      };
      await updateCustomer(customer.userId, updatedData, token);
      alert("Customer updated successfully");
      handleCancelEdit();
      fetchAllCustomers();
    } catch (err) {
      console.error("Update failed:", err.response || err);
      alert("Failed to update customer");
    }
  };

  const handleDelete = async (customer) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(customer.userId, token);
      alert("Customer deleted successfully");
      fetchAllCustomers();
    } catch (err) {
      console.error("Delete failed:", err.response || err);
      alert("Failed to delete customer");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",          // full viewport height
        width: "100vw",               // full viewport width
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // start from top
        alignItems: "center",
        backgroundColor: "#D0E7FF",
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",            // allow scrolling if table is tall
      }}
    >
      <h2 style={{ color: "#0B3D91", marginBottom: "20px" }}>Customer Management</h2>

      {/* Search */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "5px" }}>
        <input
          type="text"
          placeholder="Enter Customer ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="input"
        />
        <button onClick={handleSearch} className="button-apply">
          Search
        </button>
        <button onClick={handleReset} className="button-secondary">
          Reset
        </button>
      </div>

      {/* Customer Table */}
      <div style={{ width: "90%", maxWidth: "1000px", display: "flex", justifyContent: "center" }}>
        <table className="customers-table" style={{ width: "100%", minWidth: "600px" }}>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>User ID</th>
              <th>Aadhaar Number</th>
              <th>PAN Number</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.customerId}>
                <td>{cust.customerId}</td>
                <td>{cust.userId}</td>
                <td>
                  {editingId === cust.customerId ? (
                    <input
                      type="text"
                      value={editFields.AadharNumber}
                      onChange={(e) =>
                        setEditFields({ ...editFields, AadharNumber: e.target.value })
                      }
                    />
                  ) : (
                    cust.aadharNumber
                  )}
                </td>
                <td>
                  {editingId === cust.customerId ? (
                    <input
                      type="text"
                      value={editFields.PANNumber}
                      onChange={(e) =>
                        setEditFields({ ...editFields, PANNumber: e.target.value })
                      }
                    />
                  ) : (
                    cust.panNumber
                  )}
                </td>
                <td>
                  {editingId === cust.customerId ? (
                    <input
                      type="date"
                      value={editFields.DateOfBirth}
                      onChange={(e) =>
                        setEditFields({ ...editFields, DateOfBirth: e.target.value })
                      }
                    />
                  ) : (
                    cust.dateOfBirth.slice(0, 10)
                  )}
                </td>
                <td>
                  {editingId === cust.customerId ? (
                    <>
                      <button onClick={() => handleSaveEdit(cust)} className="button-apply">
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="button-secondary">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(cust)} className="button-update">
                        Update
                      </button>
                      <button onClick={() => handleDelete(cust)} className="button-reject">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
