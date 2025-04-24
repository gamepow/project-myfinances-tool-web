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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/public/auth/login`, {
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

    const value = { 
        user, 
        login, 
        logout, 
        loading, 
        error,
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