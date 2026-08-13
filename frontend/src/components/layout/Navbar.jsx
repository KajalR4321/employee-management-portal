import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ activeTab, toggleMobileMenu, isMobileMenuOpen }) {
    const { user, logout } = useAuth();

    // Dynamic Header Titles
    const sectionTitles = {
        dashboard: 'Dashboard Overview',
        departments: 'Department Management',
        employees: 'Employee Directory',
        requests: 'Leave Portal Requests'
    };

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm transition-all duration-200">
            
            {/* Left Section: Mobile Toggle + Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Mobile Menu Hamburger Button (Hidden on md screens and above) */}
                <button
                    onClick={toggleMobileMenu}
                    aria-label="Toggle Navigation Menu"
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                    {isMobileMenuOpen ? (
                        /* Close Icon (X) */
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        /* Hamburger Icon */
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                        {sectionTitles[activeTab] || 'Dashboard'}
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium hidden sm:block">
                        Logged in as <span className="font-semibold text-slate-600">{user?.email}</span>
                    </p>
                </div>
            </div>

            {/* Right Section: User Role & Sign Out */}
            <div className="flex items-center space-x-3 sm:space-x-4">
                {/* User Role Pill */}
                {user?.role && (
                    <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {user.role}
                    </span>
                )}

                {/* Sign Out Button */}
                <button
                    onClick={logout}
                    className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
}