// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    contactNumber: "",
    email: "",
    password: "",
    role: "User",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.dateOfBirth) {
      setMessage("Please select a valid Date of Birth");
      return;
    }

    try {
      await axios.post(
        "https://localhost:7286/api/Auth/Register",
        {
          fullName: formData.fullName,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          contactNumber: formData.contactNumber,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/customer/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage(
          "Registration failed. Please check your details and try again."
        );
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2>Register</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="register-input"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            className="register-input"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="date"
            name="dateOfBirth"
            className="register-input"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="contactNumber"
            placeholder="Contact Number"
            className="register-input"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="register-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="register-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
