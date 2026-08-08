import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load saved user and validate storage on app start
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('ems_user');
            if (savedUser && savedUser !== 'undefined') {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error('Failed to parse auth user:', error);
            localStorage.removeItem('ems_user');
            localStorage.removeItem('ems_token');
        } finally {
            setLoading(false);
        }
    }, []);

    // Login Handler: Save user info & auth tokens
    const login = (userData, token = null) => {
        setUser(userData);
        localStorage.setItem('ems_user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('ems_token', token);
        }
    };

    // Logout Handler: Wipe all stored credentials completely
    const logout = () => {
        setUser(null);
        localStorage.removeItem('ems_user');
        localStorage.removeItem('ems_token');
        localStorage.clear(); // Prevents lingering auth keys
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};