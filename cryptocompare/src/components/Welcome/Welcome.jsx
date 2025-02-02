// src/components/Welcome.jsx
import React, { useState } from 'react';
import forge from 'node-forge';
import CryptoJS from 'crypto-js'; // Import the crypto-js library
import IntroModal from '../Intro/IntroModal';
import AlgorithmModal from '../Algo/AlgorithmModal'; // Import the new modal component
import './Welcome.css'; // Import the CSS for styling

const Welcome = ({ onLogout }) => {
  const [showModal, setShowModal] = useState(true); // State to control intro modal visibility
  const [algorithmInfo, setAlgorithmInfo] = useState(null); // State to hold selected algorithm info
  const [file, setFile] = useState(null); // State to hold uploaded file info
  const [report, setReport] = useState([]); // State to hold the report data
  const [reportFile, setReportFile] = useState(null); // State for the file used to generate the report
  const [encryptDecryptFile, setEncryptDecryptFile] = useState(null); // State for the file used for encryption/decryption
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('AES'); // State for selected algorithm
  const [encryptedFile, setEncryptedFile] = useState(null); // State for the encrypted file

  const handleCloseModal = () => {
    setShowModal(false); // Close the intro modal
  };

  const algorithms = [
    { abbreviation: 'AES', fullName: 'Advanced Encryption Standard' },
    { abbreviation: 'RSA', fullName: 'Rivest-Shamir-Adleman' },
    { abbreviation: 'DES', fullName: 'Data Encryption Standard' },
    { abbreviation: 'Paillier', fullName: 'Paillier Cryptosystem' },
    { abbreviation: 'Dummy', fullName: 'Dummy Algorithm' },
  ];

  const handleAlgorithmClick = (algorithm) => {
    setAlgorithmInfo(algorithm); // Set the selected algorithm info
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile); // Set the uploaded file
  };

  const handleGenerateReport = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    // Check if the uploaded file is a text file
    if (!file.type.startsWith('text/')) {
      alert('Unsupported file type. Please upload a text file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = e.target.result; // This will be a string for text files
      console.log("file data", fileData);

      // For text files, read the text directly
      const dataToEncrypt = fileData;

      // Capture memory usage before encryption
      const memoryBefore = performance.memory.usedJSHeapSize;

      // AES Encryption and Decryption using node-forge
      const key = forge.random.getBytesSync(16); // Generate a random 16-byte key
      const iv = forge.random.getBytesSync(16); // Generate a random 16-byte IV

      // Encrypt the data
      const startEncryption = performance.now();
      const cipher = forge.cipher.createCipher('AES-CBC', key);
      cipher.start({ iv: iv });
      cipher.update(forge.util.createBuffer(dataToEncrypt));
      cipher.finish();
      const encryptedData = cipher.output;

      const endEncryption = performance.now();
      const encryptionTime = endEncryption - startEncryption;

      // Decrypt the data
      const startDecryption = performance.now();
      const decipher = forge.cipher.createDecipher('AES-CBC', key);
      decipher.start({ iv: iv });
      decipher.update(encryptedData);
      const result = decipher.finish(); // Check if the decryption was successful
      const decryptedData = result ? decipher.output.toString() : null;
      const endDecryption = performance.now();
      const decryptionTime = endDecryption - startDecryption;

      // Check if decryption was successful
      if (!decryptedData) {
        alert("Decryption failed. Please check the file and try again.");
        return;
      }

      // Calculate memory usage
      const memoryUsage = (performance.memory.usedJSHeapSize - memoryBefore) / 1024; // Convert to KB

      // Update the report state
      const newReport = {
        fileName: file.name, // Add file name to the report
        algorithm: selectedAlgorithm,
        encryptionTime: encryptionTime.toFixed(2) + ' ms',
        decryptionTime: decryptionTime.toFixed(2) + ' ms',
        memoryUsage: memoryUsage.toFixed(2) + ' KB', // Add memory usage to the report
      };
      setReport((prevReport) => [...prevReport, newReport]);
      alert('Report generated! Check the console for details.');
      console.log(newReport);
    };

    // Read the file as text for text files
    reader.readAsText(file); // Read the file as text
  };

  // Utility function to convert ArrayBuffer to Base64
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer); // Create a typed array from the ArrayBuffer
    const len = bytes.byteLength; // Get the length of the typed array
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]); // Convert each byte to a character
    }
    return window.btoa(binary); // Convert the binary string to Base64
  }

  const handleEncrypt = async () => {
    if (!encryptDecryptFile) {
      alert('Please upload a file first for encryption.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = e.target.result; // This will be an ArrayBuffer
      let dataToEncrypt;

      // Determine if the file is a text file
      if (encryptDecryptFile.type.startsWith('text/')) {
        // For text files, decode the ArrayBuffer to a string
        dataToEncrypt = new TextDecoder().decode(fileData);
      } else {
        alert('Unsupported file type. Please upload a text file.');
        return;
      }

      // Encrypt the file data using AES
      const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, 'secret-key').toString();

      // Create a Blob from the encrypted data
      const blob = new Blob([JSON.stringify({ data: encryptedData })], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Automatically download the encrypted file
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${encryptDecryptFile.name}.enc`; // Set the file name for download
      downloadLink.style.display = 'none'; // Hide the link
      document.body.appendChild(downloadLink);
      downloadLink.click(); // Trigger the download
      document.body.removeChild(downloadLink); // Clean up the DOM
      alert('File encrypted and downloaded automatically!');
    };

    // Read the file as an ArrayBuffer for binary files
    reader.readAsArrayBuffer(encryptDecryptFile);
  };

  const handleDecrypt = async () => {
    if (!encryptDecryptFile) {
      alert('Please upload an encrypted file first for decryption.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const encryptedData = e.target.result; // This will be a string

      // Decrypt the file data using AES
      const decryptedData = CryptoJS.AES.decrypt(JSON.parse(encryptedData).data, 'secret-key').toString(CryptoJS.enc.Utf8);

      // Check if decryption was successful
      if (!decryptedData || decryptedData.trim() === "") {
        alert("Decryption failed. Please check the file and try again.");
        return;
      }

      // Create a Blob from the decrypted data
      const blob = new Blob([decryptedData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      // Automatically download the decrypted file without showing the link in the DOM
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${encryptDecryptFile.name.replace('.enc', '')}`; // Set the file name for download
      downloadLink.style.display = 'none'; // Hide the link
      document.body.appendChild(downloadLink);
      downloadLink.click(); // Trigger the download
      document.body.removeChild(downloadLink); // Clean up the DOM
      alert('File decrypted and download started automatically.');
    };

    // Read the file as text for decryption
    reader.readAsText(encryptDecryptFile);
  };

  return (
    <div className="welcome-container">
      {showModal && <IntroModal onClose={handleCloseModal} />} {/* Show intro modal if true */}
      <h1 className="welcome-heading">Welcome to Our Algorithm Explorer!</h1>
      <p className="welcome-description">Explore various algorithms and their functionalities.</p>

      {/* New Section for File Upload, Info, and Generate Button */}
      <div className="file-upload-info-section">
        <input type="file" onChange={handleFileChange} className="file-input" />
        {file ? (
          <div className="file-info">
            <p><strong>File:</strong> {file.name}</p>
            <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
            <p><strong>Type:</strong> {file.type}</p>
          </div>
        ) : (
          <div className="file-info-placeholder">No file uploaded</div>
        )}
        <button className="generate-button" onClick={handleGenerateReport}>
          Generate Report
        </button>
      </div>

      <div className="algorithm-section">
        <h2>Algorithms</h2>
        <div className="algorithm-list">
          {algorithms.map((algo) => (
            <div
              key={algo.abbreviation}
              className="algorithm-circle"
              onClick={() => handleAlgorithmClick(algo)}
              title={algo.fullName} // Tooltip on hover
            >
              {algo.abbreviation}
            </div>
          ))}
        </div>
      </div>
      {algorithmInfo && <AlgorithmModal algorithm={algorithmInfo} onClose={() => setAlgorithmInfo(null)} />} {/* Show algorithm modal */}
      <button onClick={onLogout} className="logout-button">Logout</button> {/* Logout button */}

      {/* Report Section */}
      {report.length > 0 && (
      <div className="report-section">
        <h2>Report</h2>
        <table>
          <thead>
            <tr>
              <th>File Name</th> {/* New column for file name */}
              <th>Algorithm Used</th>
              <th>Encryption Time</th>
              <th>Decryption Time</th>
              <th>Memory Usage</th> {/* New column for memory usage */}
            </tr>
          </thead>
          <tbody>
            {report.map((entry, index) => (
              <tr key={index}>
                <td title={entry.fileName}> {/* Tooltip for full file name */}
                  {entry.fileName.length > 25 ? `${entry.fileName.substring(0, 25)}...` : entry.fileName}
                </td> {/* Display truncated file name */}
                <td>{entry.algorithm}</td>
                <td>{entry.encryptionTime}</td>
                <td>{entry.decryptionTime}</td>
                <td>{entry.memoryUsage}</td> {/* Display memory usage */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* New Section for File Upload, Algorithm Selection, and Buttons for Encryption/Decryption */}
    <div className="file-upload-info-section">
      <input 
        type="file" 
        onChange={(e) => setEncryptDecryptFile(e.target.files[0])} 
        className="file-input" 
      />
      <select value={selectedAlgorithm} onChange={(e) => setSelectedAlgorithm(e.target.value)}>
        <option value="AES">AES</option>
        {/* Add more algorithms here in the future if needed */}
      </select>
      <button className="encrypt-button" onClick={handleEncrypt}>
        Encrypt
      </button>
      <button className="decrypt-button" onClick={handleDecrypt}>
        Decrypt
      </button>
    </div>
    </div>
  );
};

export default Welcome;