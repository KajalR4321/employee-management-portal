import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Formats user object so employeeId is always available
    const formatUser = (userData) => {
        if (!userData) return null;
        return {
            ...userData,
            employeeId: userData.employeeId || userData._id || userData.id || userData.employee_id
        };
    };

    // Load saved user on app start
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('ems_user');
            if (savedUser && savedUser !== 'undefined') {
                const parsed = JSON.parse(savedUser);
                setUser(formatUser(parsed));
            }
        } catch (error) {
            console.error('Failed to parse auth user:', error);
            localStorage.removeItem('ems_user');
            localStorage.removeItem('ems_token');
        } finally {
            setLoading(false);
        }
    }, []);

    // Login Handler
    const login = (userData, token = null) => {
        const formatted = formatUser(userData);
        setUser(formatted);
        localStorage.setItem('ems_user', JSON.stringify(formatted));
        if (token) {
            localStorage.setItem('ems_token', token);
        }
    };

    // Logout Handler
    const logout = () => {
        setUser(null);
        localStorage.removeItem('ems_user');
        localStorage.removeItem('ems_token');
        localStorage.clear();
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