import '../components/css/Login.css';
import '../components/css/Main.css';
import { useNavigation } from '../context/NavigationContext';
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';

function Login() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, user } = useUser();
  const navigate =useNavigation();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(username, password);
    /*if(!error){
      navigate('/dashboard');
    }*/
  };

  useEffect(() => {
    if (user && !error) {
      navigate('/dashboard');
    }
  }, [user, error, navigate]);

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
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login' }
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <footer>
          <p>&copy; {new Date().getFullYear()} My Project Admin</p>
      </footer>
    </div>
  );

}

export default Login;
