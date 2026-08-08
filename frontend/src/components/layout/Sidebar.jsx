import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab }) {
    const { user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Navigation Config with Role Access Control
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'EMPLOYEE'] },
        { id: 'departments', label: 'Departments', icon: '🏢', roles: ['ADMIN'] },
        { id: 'employees', label: 'Employee Directory', icon: '👥', roles: ['ADMIN'] },
        { id: 'requests', label: 'Leave Portal', icon: '🌴', roles: ['ADMIN', 'EMPLOYEE'] },
    ];

    const handleNavClick = (id) => {
        setActiveTab(id);
        setIsMobileOpen(false); // Close mobile drawer when an item is selected
    };

    return (
        <>
            {/* 1. Mobile Hamburger Menu Toggle Button (Visible on < md screens) */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
                aria-label="Toggle Mobile Navigation"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* 2. Mobile Backdrop Overlay */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
                />
            )}

            {/* 3. Main Responsive Sidebar Container */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 md:relative md:z-auto min-h-screen flex flex-col justify-between p-4 bg-slate-900 text-slate-300 border-r border-slate-800/80 transition-all duration-300 ease-in-out select-none
                    ${/* Mobile Off-canvas Slide state */ ''}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    ${/* Desktop Dynamic Width state */ ''}
                    ${isCollapsed ? 'md:w-20' : 'md:w-64'}
                    w-64
                `}
            >
                {/* Dynamic Floating Collapse Button (Desktop Only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3.5 top-7 bg-indigo-600 hover:bg-indigo-500 active:scale-90 text-white w-7 h-7 rounded-full items-center justify-center text-xs shadow-lg shadow-indigo-600/30 transition-all duration-300 border-2 border-slate-900 z-30"
                    title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                    <span className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                        ◀
                    </span>
                </button>

                <div className="space-y-6">
                    {/* Company Logo Header */}
                    <div className="flex items-center justify-between px-2 py-2 border-b border-slate-800/60">
                        <div className="flex items-center space-x-3.5 overflow-hidden">
                            {/* Logo Mark Icon */}
                            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0 transform transition-transform duration-300 hover:scale-105">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
                            </div>

                            {/* Company Name & Tagline */}
                            <div
                                className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'opacity-100 w-auto'
                                    }`}
                            >
                                <h1 className="font-extrabold text-white tracking-tight text-base leading-none">
                                    APEX<span className="text-indigo-400">CORP</span>
                                </h1>
                                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                                    Workforce OS
                                </p>
                            </div>
                        </div>

                        {/* Mobile Drawer Close Button */}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden text-slate-400 hover:text-white p-1"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Dynamic Navigation Options */}
                    <nav className="space-y-1.5">
                        {navItems.map((item) => {
                            if (!item.roles.includes(user?.role)) return null;
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`group relative w-full flex items-center px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ease-in-out ${isActive
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/35 translate-x-1'
                                            : 'text-slate-400 hover:bg-slate-800/80 hover:text-white hover:translate-x-1'
                                        }`}
                                >
                                    {/* Active Indicator Bar */}
                                    {isActive && (
                                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-200 rounded-r-full transition-all duration-300" />
                                    )}

                                    {/* Icon */}
                                    <span className="text-lg shrink-0 transition-transform duration-200 group-hover:scale-110">
                                        {item.icon}
                                    </span>

                                    {/* Nav Label */}
                                    <span
                                        className={`ml-3.5 font-semibold text-xs tracking-wide whitespace-nowrap transition-all duration-300 ${isCollapsed
                                                ? 'md:opacity-0 md:w-0 md:overflow-hidden md:ml-0'
                                                : 'opacity-100 w-auto'
                                            }`}
                                    >
                                        {item.label}
                                    </span>

                                    {/* Floating Tooltip Label (Desktop Collapsed Mode Only) */}
                                    {isCollapsed && (
                                        <div className="hidden md:block absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-slate-700/80">
                                            {item.label}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* User Profile Badge Footer */}
                <div className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-2xl flex items-center space-x-3 border border-slate-800/80 transition-all duration-200 overflow-hidden">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-500/30 shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div
                        className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'opacity-100 w-auto'
                            }`}
                    >
                        <p className="text-xs font-semibold text-white truncate">{user?.name || 'User Profile'}</p>
                        <p className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase">
                            {user?.role || 'Guest'}
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}