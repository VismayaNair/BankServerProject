// src/pages/admin/LoanProductsPage.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getAllLoanProducts,
  createLoanProduct,
  updateLoanProduct,
  deleteLoanProduct,
} from "../../api/loanProducts";
import "../../styles/Components.css";

export default function LoanProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({
    Name: "",
    InterestRate: "",
    TenureMonths: "",
  });
  const [newProduct, setNewProduct] = useState({
    Name: "",
    InterestRate: "",
    TenureMonths: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const data = await getAllLoanProducts(token);
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch loan products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingId(product.loanProductId);
    setEditFields({
      Name: product.name,
      InterestRate: product.interestRate,
      TenureMonths: product.tenureMonths,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFields({ Name: "", InterestRate: "", TenureMonths: "" });
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateLoanProduct(id, { loanProductId: id, ...editFields }, token);
      alert("Loan product updated successfully");
      handleCancelEdit();
      fetchProducts();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update loan product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteLoanProduct(id, token);
      alert("Loan product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product");
    }
  };

  const handleAddNew = async () => {
    try {
      await createLoanProduct(newProduct, token);
      alert("Loan product added successfully");
      setNewProduct({ Name: "", InterestRate: "", TenureMonths: "" });
      fetchProducts();
    } catch (err) {
      console.error("Add failed:", err);
      alert("Failed to add loan product");
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return fetchProducts();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filtered);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    fetchProducts();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#d4e7fc", // pastel blue
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <h2 style={{ color: "#0B3D91", marginBottom: "20px" }}>
        Loan Products Management
      </h2>

      {/* Search */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "5px" }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
          style={{ border: "1px solid black" }}
        />
        <button onClick={handleSearch} className="button button-apply">
          Search
        </button>
        <button onClick={handleResetSearch} className="button button-secondary">
          Reset
        </button>
      </div>

      {/* Add New Product */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "5px" }}>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.Name}
          onChange={(e) => setNewProduct({ ...newProduct, Name: e.target.value })}
          className="input"
          style={{ border: "1px solid black" }}
        />
        <input
          type="number"
          placeholder="Interest Rate"
          value={newProduct.InterestRate}
          onChange={(e) => setNewProduct({ ...newProduct, InterestRate: e.target.value })}
          className="input"
          style={{ border: "1px solid black" }}
        />
        <input
          type="number"
          placeholder="Tenure Months"
          value={newProduct.TenureMonths}
          onChange={(e) => setNewProduct({ ...newProduct, TenureMonths: e.target.value })}
          className="input"
          style={{ border: "1px solid black" }}
        />
        <button onClick={handleAddNew} className="button button-apply">
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <table
          style={{
            minWidth: "700px",
            borderCollapse: "collapse",
            backgroundColor: "white",
          }}
          border="1"
          cellPadding="10"
        >
          <thead style={{ backgroundColor: "#c0d4e4" }}> {/* light blue header */}
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Interest Rate (%)</th>
              <th>Tenure (Months)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.loanProductId}>
                <td>{p.loanProductId}</td>
                <td>
                  {editingId === p.loanProductId ? (
                    <input
                      type="text"
                      value={editFields.Name}
                      onChange={(e) =>
                        setEditFields({ ...editFields, Name: e.target.value })
                      }
                      className="input"
                      style={{ border: "1px solid black" }}
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td>
                  {editingId === p.loanProductId ? (
                    <input
                      type="number"
                      value={editFields.InterestRate}
                      onChange={(e) =>
                        setEditFields({ ...editFields, InterestRate: e.target.value })
                      }
                      className="input"
                      style={{ border: "1px solid black" }}
                    />
                  ) : (
                    p.interestRate
                  )}
                </td>
                <td>
                  {editingId === p.loanProductId ? (
                    <input
                      type="number"
                      value={editFields.TenureMonths}
                      onChange={(e) =>
                        setEditFields({ ...editFields, TenureMonths: e.target.value })
                      }
                      className="input"
                      style={{ border: "1px solid black" }}
                    />
                  ) : (
                    p.tenureMonths
                  )}
                </td>
                <td>
                  {editingId === p.loanProductId ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(p.loanProductId)}
                        className="button button-apply"
                        style={{ marginRight: "5px" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="button button-secondary"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(p)}
                        className="button button-secondary"
                        style={{ marginRight: "5px" }}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(p.loanProductId)}
                        className="button button-reject"
                      >
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
