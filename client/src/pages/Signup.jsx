import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password
      });
      setSuccessMessage('✅ Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right, #6a11cb, #2575fc)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px'
  };

  const formStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2575fc',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const messageStyle = {
    marginTop: '10px',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Signup</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#1a5edb'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#2575fc'}
        >
          Signup
        </button>
        {successMessage && <p style={{ ...messageStyle, color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ ...messageStyle, color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
}
