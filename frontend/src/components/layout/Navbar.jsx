import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ activeTab }) {
    const { user, logout } = useAuth();

    // Dynamic Header Titles
    const sectionTitles = {
        dashboard: 'Dashboard Overview',
        departments: 'Department Management',
        employees: 'Employee Directory',
        requests: 'Leave Portal Requests'
    };

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm transition-all duration-200">
            <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                    {sectionTitles[activeTab] || 'Dashboard'}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    Logged in as <span className="font-semibold text-slate-600">{user?.email}</span>
                </p>
            </div>

            <div className="flex items-center space-x-4">
                {/* User Role Pill */}
                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {user?.role}
                </span>

                {/* Sign Out Action Button */}
                <button
                    onClick={logout}
                    className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
}