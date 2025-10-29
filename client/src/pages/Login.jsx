import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // useNavigate hook for navigation

  function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    axios.post('http://localhost:5000/api/auth/login', { email, password })
      .then(response => {
        localStorage.setItem('userId', response.data.userId);  // Store userId in localStorage
        setSuccessMessage('✅ Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');  // Redirect to the dashboard after a short delay
        }, 1000); // 1-second delay to show message
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setErrorMessage('❌ Login failed. Please check your email and password.');
      });
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
      {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
    </div>
  );
}
