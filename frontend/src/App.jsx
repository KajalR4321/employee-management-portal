import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages & Route Guard (from pages/auth)
import Login from './pages/auth/Login';
import ProtectedRoute from './pages/auth/Protectedroute';

// Layout Shell
import Layout from './components/layout/Layout';

// Page Components (matching your exact folder names)
import Dashboard from './pages/dashboard/Dashboard';
import Department from './pages/department/Department';
import Employees from './pages/employee/Employees';
import LeaveRequests from './pages/requests/LeaveRequests';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 antialiased flex flex-col overflow-x-hidden">
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="requests" element={<LeaveRequests />} />

              {/* Admin Routes */}
              <Route
                path="departments"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Department />
                  </ProtectedRoute>
                }
              />
              <Route
                path="employees"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <Employees />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}