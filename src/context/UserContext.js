import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = async (userName, password) => {
        setLoading(true);
        setError(null);
        try{
            const userData = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });
            if(!userData.ok){
                throw new Error('Invalid credentials');
            }
            setUser(userData);
            setLoading(false);
        } catch(err){
            setError(err.message);
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const value = { 
        user, 
        login, 
        logout, 
        loading, 
        error 
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