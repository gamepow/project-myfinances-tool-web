import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (username, password) => {
        setLoading(true);
        setError(false);
        try{
            const response = await fetch('http://localhost:8080/api/public/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            if(!response.ok){
                setError(true);
                throw new Error('Invalid credentials');
            }
            const userData = await response.json();
            setUser(userData);
            localStorage.setItem('token', userData.token); // Store token in local storage
            setLoading(false);
        } catch(err){
            setError(true);
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`, // Add the Authorization header
        };
    
        const response = await fetch(url, {
            ...options,
            headers,
        });
    
        if (response.status === 401) {
            // Token expired or invalid
            logout(); // Call the logout function to clear user data
            throw new Error('Unauthorized');
        }
    
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
    
        return response.json();
    };

    const value = { 
        user, 
        login, 
        logout, 
        loading, 
        error,
        fetchWithAuth, // Expose fetchWithAuth
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};