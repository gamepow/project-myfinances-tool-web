import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Function to check if the user is authenticated
    const isAuthenticated = () => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    };

    useEffect(() => {
        const storedUser = isAuthenticated();
        if (storedUser) {
          setUser(storedUser);
        }
      }, []);

    // Memoize the login function
  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Redirect to the intended page after login
      const redirectPath = location.state?.path || '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [navigate, location]);

  // Memoize the logout function
    const logout = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    }, [navigate]);

    const fetchWithAuth = useCallback(
        async (url, options = {}) => {
            const storedUser = isAuthenticated();
            if (!storedUser) {
            console.error('User not authenticated');
            logout();
            return null;
            }

            const headers = {
            ...options.headers,
            Authorization: `Bearer ${storedUser.token}`,
            };

            try {
            const response = await axios(url, {
                ...options,
                headers,
            });
            return response.data;
            } catch (error) {
            console.error('Error fetching data with auth:', error);
            if (error.response && error.response.status === 403) {
                // Handle unauthorized error
                logout();
            }
            throw error;
            }
        },
        [isAuthenticated, logout]
        );

    const contextValue = {
        user,
        login,
        logout,
        fetchWithAuth,
        };
    
        return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
        );
    };
    
    export const useUser = () => {
        return useContext(UserContext);
    };