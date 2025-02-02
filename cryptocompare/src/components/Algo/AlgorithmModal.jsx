// src/components/AlgorithmModal.jsx
import React from 'react';
import './AlgorithmModal.css'; // Import the CSS for the modal

const AlgorithmModal = ({ algorithm, onClose }) => {
  if (!algorithm) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{algorithm.fullName}</h2>
        <p>{algorithm.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AlgorithmModal;