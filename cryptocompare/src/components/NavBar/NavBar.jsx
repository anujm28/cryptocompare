// src/components/Navbar.jsx
import React from 'react';
import './Navbar.css'; // Import your CSS for styling

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">CryptoCompare</div>
      <button className="logout-button" onClick={onLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;