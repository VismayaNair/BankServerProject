// src/pages/customer/ViewLoanProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ViewLoanProducts.css"; // updated CSS

export default function ViewLoanProducts() {
  const { token } = useAuth();
  const [loanProducts, setLoanProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLoanProducts = async () => {
    try {
      const response = await axios.get("https://localhost:7286/api/LoanProduct", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoanProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      console.error("Error fetching loan products:", err);
      setError("Failed to load loan products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      setFilteredProducts(loanProducts);
    } else {
      const filtered = loanProducts.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  if (loading) return <p className="loading-text">Loading loan products...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="loan-products-page">
      <h1 className="page-title">Available Loan Products</h1>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {/* Products grid */}
      {filteredProducts.length === 0 ? (
        <p className="no-products">No loan products found.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.loanProductId} className="product-card">
              <p><strong>Product ID:</strong> {product.loanProductId}</p>
              <p><strong>Name:</strong> {product.name}</p>
              <p><strong>Interest Rate:</strong> {product.interestRate}%</p>
              <p><strong>Tenure:</strong> {product.tenureMonths} months</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
