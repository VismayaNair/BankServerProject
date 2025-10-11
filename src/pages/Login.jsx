// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css"; // Login styles (pastel background, transparent box)
import "../styles/Components.css"; // Button styles

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:7286/api/Auth/Login",
        {
          UserName: username, // must match backend exactly
          Password: password, // must match backend exactly
        }
      );

      const { roles } = response.data;

      // Update context
      login(response.data);

      // Navigate based on role
      if (roles[0] === "User") navigate("/customer/dashboard");
      else if (roles[0] === "Admin") navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2 className="login-heading">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
