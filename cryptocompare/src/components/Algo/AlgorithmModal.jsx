// src/components/AlgorithmModal.jsx
import React from 'react';
import './AlgorithmModal.css'; // Import the CSS for the modal

function AlgorithmModal({ algorithm, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{algorithm.fullName}</h2>
        <p>
          This is a brief description of the {algorithm.fullName}. 
          Algorithms are step-by-step procedures or formulas for solving problems. 
          They are essential in computer science and programming for tasks such as data processing, 
          automated reasoning, and other computational tasks.
        </p>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default AlgorithmModal;