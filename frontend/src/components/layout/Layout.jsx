import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Dashboard from '../../pages/dashboard/Dashboard';
import Departments from '../../pages/department/Department';
import Employees from '../../pages/employee/Employees';
import LeaveRequests from '../../pages/requests/LeaveRequests';

export default function Layout() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex h-screen w-full bg-slate-50 font-sans antialiased selection:bg-indigo-500 selection:text-white overflow-hidden">

            {/* ============================
                SIDEBAR (Desktop & Mobile)
            ============================ */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isMobileMenuOpen}
                onClose={closeMobileMenu}
            />

            {/* ============================
                MAIN SHELL
            ============================ */}
            <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">

                {/* FIXED / STICKY NAVBAR */}
                <header className="sticky top-0 z-[40] flex-shrink-0 bg-white border-b border-slate-200 shadow-sm">
                    <Navbar 
                        activeTab={activeTab} 
                        toggleMobileMenu={toggleMobileMenu}
                        isMobileMenuOpen={isMobileMenuOpen}
                    />
                </header>

                {/* SCROLLABLE CONTENT */}
                <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                    <div className="w-full p-4 sm:p-5 md:p-6 lg:p-8">
                        <div className="w-full max-w-[1600px] mx-auto">
                            {activeTab === 'dashboard' && <Dashboard />}
                            {activeTab === 'departments' && <Departments />}
                            {activeTab === 'employees' && <Employees />}
                            {activeTab === 'requests' && <LeaveRequests />}
                        </div>
                    </div>
                </main>

            </div>

        </div>
    );
}