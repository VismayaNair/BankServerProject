// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/image.png";
import "../styles/Home.css"; // Home page styles
import "../styles/Components.css"; // Button styles

const Home = () => {
  return (
    <div className="home-container">
      {/* Logo */}
      <img src={logo} alt="BankEase Logo" className="home-logo" />

      {/* Title */}
      <div className="home-title-box">
        <h1 className="home-title">
          🏦 Welcome to <span>BankEase</span>
        </h1>
      </div>

      {/* Subtitle */}
      <div className="home-subtitle-box">
        <p>Your trusted platform for seamless banking at your fingertips.</p>
      </div>

      {/* Buttons */}
      <div className="home-buttons">
        <Link to="/customer/login">
          <button className="button button-login">Customer Login</button>
        </Link>

        {/* Register button */}
        <Link to="/register">
          <button className="button button-register">Register</button>
        </Link>

        <Link to="/admin/login">
          <button className="button button-apply">Admin Login</button>
        </Link>
      </div>

      {/* Footer */}
      <div className="home-footer-box">
        &copy; {new Date().getFullYear()} BankEase. All rights reserved.
      </div>
    </div>
  );
};

export default Home;
