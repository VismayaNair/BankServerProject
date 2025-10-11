import React from 'react';
import logo from '../assets/logo.png';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-4 bg-darkblue shadow-md">
      <img src={logo} alt="BankEase Logo" className="w-24" />
      <ul className="flex space-x-6 text-white font-semibold">
        <li><a href="/">Home</a></li>
        <li><a href="/transactions">Transactions</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  );
}
