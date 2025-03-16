import '../components/css/Login.css';
import '../components/css/Main.css';
import { useNavigation } from '../context/NavigationContext';
import React, { useState } from 'react';

function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        
        const data = await response.json();
        // Store the JWT token in local storage or cookies
        localStorage.setItem('token', data.token);
        alert("Login Exitoso!");
        // TODO: add redirect to home page
        // window.location.href = '/main';

      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      setError("An error occurred during login: " + error);
    }
  };

  const navigate =useNavigation();

  const handleHomePage = () => {
      navigate('/')
  }

  return (
    <div className="landingPage">
      <header>
          <h1>My Project Administrator</h1>
          <button onClick={handleHomePage}>Home</button>
      </header>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <footer>
          <p>&copy; {new Date().getFullYear()} My Project Admin</p>
      </footer>
    </div>
  );

}

export default Login;
