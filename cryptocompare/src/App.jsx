// src/App.jsx
import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import Welcome from './components/Welcome/Welcome';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [resetFields, setResetFields] = useState(false); // State to trigger field reset

  const handleSwitch = () => {
    setShowLogin((prev) => !prev); // Toggle the form
    setResetFields((prev) => !prev); // Trigger reset of fields
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Set login status to true
    setResetFields(false); // Reset fields when logging in
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Set login status to false
    setResetFields(true); // Trigger reset of fields on logout
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Welcome onLogout={handleLogout} /> // Pass logout handler to Welcome component
      ) : (
        <AuthForm onSwitch={handleSwitch} isLogin={showLogin} onLoginSuccess={handleLoginSuccess} resetFields={resetFields} />
      )}
    </div>
  );
}

export default App;