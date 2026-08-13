import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Pages & Route Guard
import Login from './pages/auth/Login';
import ProtectedRoute from './pages/auth/Protectedroute';

// Layout Shell
import Layout from './components/layout/Layout';

// Page Components
import Dashboard from './pages/dashboard/Dashboard';
import Department from './pages/department/Department';
import Employees from './pages/employee/Employees';
import LeaveRequests from './pages/requests/LeaveRequests';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>

                <div className="min-h-screen w-full bg-slate-50 font-sans text-slate-800 antialiased">

                    <Routes>

                        {/* ================================
                            PUBLIC ROUTE
                        ================================= */}
                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        {/* ================================
                            PROTECTED LAYOUT
                        ================================= */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }
                        >

                            {/* Default */}
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="/dashboard"
                                        replace
                                    />
                                }
                            />

                            {/* Dashboard */}
                            <Route
                                path="dashboard"
                                element={<Dashboard />}
                            />

                            {/* Leave Requests */}
                            <Route
                                path="requests"
                                element={<LeaveRequests />}
                            />

                            {/* ================================
                                ADMIN ROUTES
                            ================================= */}

                            <Route
                                path="departments"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={['ADMIN']}
                                    >
                                        <Department />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="employees"
                                element={
                                    <ProtectedRoute
                                        allowedRoles={['ADMIN']}
                                    >
                                        <Employees />
                                    </ProtectedRoute>
                                }
                            />

                        </Route>

                        {/* ================================
                            FALLBACK
                        ================================= */}
                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            }
                        />

                    </Routes>

                </div>

            </BrowserRouter>
        </AuthProvider>
    );
}