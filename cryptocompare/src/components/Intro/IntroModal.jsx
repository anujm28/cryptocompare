// src/components/IntroModal.jsx
import React from 'react';
import './IntroModal.css'; // Import the CSS for the modal

function IntroModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to Our Website!</h2>
        <p>
          This website is designed to help you manage your cryptocurrency portfolio effectively. 
          You can track prices, analyze trends, and make informed decisions about your investments. 
          Our user-friendly interface and powerful tools make it easy for both beginners and experienced traders to navigate the world of cryptocurrencies. 
          Join us today and take control of your financial future!
        </p>
        <button className="next-button" onClick={onClose}> &gt; Next </button>
      </div>
    </div>
  );
}

export default IntroModal;