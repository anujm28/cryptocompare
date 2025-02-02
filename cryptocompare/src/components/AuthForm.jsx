// src/components/AuthForm.jsx
import React, { useState, useEffect } from 'react';
import '../styles/FormStyles.css'; // Import the CSS file

function AuthForm({ onSwitch, isLogin, onLoginSuccess, resetFields }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold error messages
  const [emailError, setEmailError] = useState(''); // State for email validation error
  const [passwordError, setPasswordError] = useState(''); // State for password validation error

  // Reset fields when the component mounts or when resetFields changes
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
    setEmailError('');
    setPasswordError('');
  }, [resetFields]);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password length
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Debounce validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email && !validateEmail(email)) {
        setEmailError('Invalid email format');
      } else {
        setEmailError('');
      }

      if (password && !validatePassword(password)) {
        setPasswordError('Password must be at least 8 characters long');
      } else {
        setPasswordError('');
      }
    }, 500); // 500 milliseconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages

    // Check for validation errors before submitting
    if (emailError || passwordError) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          onLoginSuccess(); // Call the function to handle successful login
        } else {
          alert('Signup successful! You can now log in.'); // Alert for successful signup
          onSwitch(); // Switch to the login form
        }
      } else {
        setError(data.error); // Set error message if signup/login fails
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.'); // Set a generic error message
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Signup'}</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <p className="error-message" style={{ color: 'red' }}>{emailError}</p>} {/* Email validation error */}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && <p className="error-message" style={{ color: 'red' }}>{passwordError}</p>} {/* Password validation error */}

        <button type="submit" disabled={!!emailError || !!passwordError}>{isLogin ? 'Login' : 'Signup'}</button>
        <button type="button" className="switch-button" onClick={onSwitch}>
          Switch to {isLogin ? 'Signup' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;