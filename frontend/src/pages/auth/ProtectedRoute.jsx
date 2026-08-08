import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth(); // 1. Pull loading from AuthContext

    // 2. Wait until authentication check finishes before making redirect decisions
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-medium">
                Restoring session...
            </div>
        );
    }

    // 3. Redirect to login if unauthenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 4. Redirect to dashboard if user role is not authorized
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}