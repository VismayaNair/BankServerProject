// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css"; // Use same style as customer login
import "../styles/Components.css"; // Button styles

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://localhost:7286/api/Auth/Login", {
        UserName: username, // match backend
        Password: password, // match backend
      });

      const { roles } = response.data;

      // Store user & token in AuthContext
      login(response.data);

      // Navigate based on role
      if (roles[0] === "Admin") navigate("/admin/dashboard");
      else if (roles[0] === "User") navigate("/customer/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2 className="login-heading">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
