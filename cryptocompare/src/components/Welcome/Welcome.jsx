// src/components/Welcome.jsx
import React, { useState, useEffect } from 'react';
import forge from 'node-forge';
import IntroModal from '../Intro/IntroModal';
import AlgorithmModal from '../Algo/AlgorithmModal'; // Import the new modal component
import Navbar from '../NavBar/NavBar'; // Import the Navbar component
import './Welcome.css'; // Import the CSS for styling


const algorithms = [
  {
    abbreviation: 'AES',
    fullName: 'Advanced Encryption Standard',
    description: 'AES is a symmetric encryption algorithm that is widely used across the globe. It operates on fixed block sizes of 128 bits and supports key sizes of 128, 192, and 256 bits.'
  },
  {
    abbreviation: 'DES',
    fullName: 'Data Encryption Standard',
    description: 'DES is a symmetric-key algorithm for the encryption of digital data. It uses a 56-bit key and operates on 64-bit blocks of data.'
  },
  {
    abbreviation: 'Paillier',
    fullName: 'Paillier Cryptosystem',
    description: 'The Paillier cryptosystem is a probabilistic asymmetric algorithm that allows for homomorphic encryption. It is particularly useful for secure voting and privacy-preserving computations.'
  }
];

const Welcome = ({ onLogout }) => {
  const [showModal, setShowModal] = useState(true); // State to control intro modal visibility
  const [algorithmInfo, setAlgorithmInfo] = useState(null); // State to hold selected algorithm info
  const [file, setFile] = useState(null); // State to hold uploaded file info
  const [report, setReport] = useState([]); // State to hold the report data
  const [reportFile, setReportFile] = useState(null); // State for the file used to generate the report
  const [encryptDecryptFile, setEncryptDecryptFile] = useState(null); // State for the file used for encryption/decryption
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('AES'); // State for selected algorithm
  const [encryptedFile, setEncryptedFile] = useState(null); // State for the encrypted file
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for login status
  
  useEffect(() => {
    // Check if the user is logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false); // Close the intro modal
  };

  const handleAlgorithmClick = (algo) => {
    setAlgorithmInfo(algo); // Set the selected algorithm info
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
      const aesKey = forge.random.getBytesSync(16); // Generate a random 16-byte key
      const aesIv = forge.random.getBytesSync(16); // Generate a random 16-byte IV

      // AES Encryption
      const startAESEncryption = performance.now();
      const aesCipher = forge.cipher.createCipher('AES-CBC', aesKey);
      aesCipher.start({ iv: aesIv });
      aesCipher.update(forge.util.createBuffer(dataToEncrypt));
      aesCipher.finish();
      const aesEncryptedData = aesCipher.output;

      const endAESEncryption = performance.now();
      const aesEncryptionTime = endAESEncryption - startAESEncryption;

      // AES Decryption
      const startAESDecryption = performance.now();
      const aesDecipher = forge.cipher.createDecipher('AES-CBC', aesKey);
      aesDecipher.start({ iv: aesIv });
      aesDecipher.update(aesEncryptedData);
      const aesResult = aesDecipher.finish(); // Check if the decryption was successful
      const aesDecryptedData = aesResult ? aesDecipher.output.toString() : null;
      const endAESDecryption = performance.now();
      const aesDecryptionTime = endAESDecryption - startAESDecryption;

      // Check if AES decryption was successful
      if (!aesDecryptedData) {
        alert("AES Decryption failed. Please check the file and try again.");
        return;
      }

      // DES Encryption and Decryption using node-forge
      const desKey = forge.random.getBytesSync(8); // Generate a random 8-byte key for DES
      const desIv = forge.random.getBytesSync(8); // Generate a random 8-byte IV for DES

      // DES Encryption
      const startDESEncryption = performance.now();
      const desCipher = forge.cipher.createCipher('DES-CBC', desKey);
      desCipher.start({ iv: desIv });
      desCipher.update(forge.util.createBuffer(dataToEncrypt));
      desCipher.finish();
      const desEncryptedData = desCipher.output;

      const endDESEncryption = performance.now();
      const desEncryptionTime = endDESEncryption - startDESEncryption;

      // DES Decryption
      const startDESDecryption = performance.now();
      const desDecipher = forge.cipher.createDecipher('DES-CBC', desKey);
      desDecipher.start({ iv: desIv });
      desDecipher.update(desEncryptedData);
      const desResult = desDecipher.finish(); // Check if the decryption was successful
      const desDecryptedData = desResult ? desDecipher.output.toString() : null;
      const endDESDecryption = performance.now();
      const desDecryptionTime = endDESDecryption - startDESDecryption;

      // Check if DES decryption was successful
      if (!desDecryptedData) {
        alert("DES Decryption failed. Please check the file and try again.");
        return;
      }

      // Calculate memory usage
      const memoryUsage = (performance.memory.usedJSHeapSize - memoryBefore) / 1024; // Convert to KB

      // Update the report state for AES
      const aesReport = {
        fileName: file.name, // Add file name to the report
        algorithm: 'AES',
        encryptionTime: aesEncryptionTime.toFixed(2) + ' ms',
        decryptionTime: aesDecryptionTime.toFixed(2) + ' ms',
        memoryUsage: memoryUsage.toFixed(2) + ' KB', // Add memory usage to the report
      };

      // Update the report state for DES
      const desReport = {
        fileName: file.name, // Add file name to the report
        algorithm: 'DES',
        encryptionTime: desEncryptionTime.toFixed(2) + ' ms',
        decryptionTime: desDecryptionTime.toFixed(2) + ' ms',
        memoryUsage: memoryUsage.toFixed(2) + ' KB', // Add memory usage to the report
      };

      // Combine reports
      setReport((prevReport) => [...prevReport, aesReport, desReport]);
      alert('Report generated! Check the console for details.');
      console.log(aesReport);
      console.log(desReport);
    };

    // Read the file as text for text files
    reader.readAsText(file); // Read the file as text
  };

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

      let encryptedData;

      if (selectedAlgorithm === 'AES') {
        // AES Encryption
        console.log("AES Encryption");
        const key = forge.util.hexToBytes('0123456789abcdef0123456789abcdef'); // Fixed 16-byte key (in hex format)
        const iv = forge.util.hexToBytes('abcdef9876543210abcdef9876543210');  // Fixed 16-byte IV (in hex format)

        const cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({ iv: iv });
        cipher.update(forge.util.createBuffer(dataToEncrypt));
        cipher.finish();
        encryptedData = cipher.output.toHex(); // Convert to hex for storage
      }else if (selectedAlgorithm === 'DES') {
        // DES Encryption
        console.log("DES Encryption");
        const key = forge.util.hexToBytes('0123456789abcdef0123456789abcdef'); // Generate a random 8-byte key for DES
        const iv = forge.util.hexToBytes('abcdef9876543210abcdef9876543210');// Generate a random 8-byte IV for DES

        const cipher = forge.cipher.createCipher('DES-CBC', key);
        cipher.start({ iv: iv });
        cipher.update(forge.util.createBuffer(dataToEncrypt));
        cipher.finish();
        encryptedData = cipher.output.toHex(); // Convert to hex for storage

        // Store the key and IV for decryption
        console.log("DES Encryption Key (Base64):", forge.util.encode64(key));
        console.log("DES IV (Base64):", forge.util.encode64(iv));
      }
    
      

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
      const encryptedData = JSON.parse(e.target.result).data; 
      let decryptedData;

      if (selectedAlgorithm === 'AES') {
        const key = forge.util.hexToBytes('0123456789abcdef0123456789abcdef'); // Fixed 16-byte key (in hex format)
        const iv = forge.util.hexToBytes('abcdef9876543210abcdef9876543210');  // Fixed 16-byte IV (in hex format)
      // Use the same IV used for encryption

        const decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({ iv: iv });
        decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encryptedData))); // Convert hex to bytes
        const result = decipher.finish(); // Check if the decryption was successful
        decryptedData = result ? decipher.output.toString() : null;

      } else if (selectedAlgorithm === 'DES') {
        // DES Decryption
        const key = forge.util.hexToBytes('0123456789abcdef0123456789abcdef');
        const iv = forge.util.hexToBytes('abcdef9876543210abcdef9876543210');

        const decipher = forge.cipher.createDecipher('DES-CBC', key);
        decipher.start({ iv: iv });
        decipher.update(forge.util.createBuffer(forge.util.hexToBytes(encryptedData))); // Convert hex to bytes
        const result = decipher.finish(); // Check if the decryption was successful
        decryptedData = result ? decipher.output.toString() : null;
        console.log("decryptedData", decryptedData);
      }

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

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Clear login state
    onLogout(); // Call the logout function passed as a prop
  };

  // Mock login function for demonstration
  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true'); // Set login state
    setIsLoggedIn(true); // Update state
  };

  return (
    <div className="welcome-container">
      <Navbar onLogout={handleLogout} /> {/* Add the Navbar here */}
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
        <option value="DES">DES</option>
        <option value="Paillier">Paillier</option>
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