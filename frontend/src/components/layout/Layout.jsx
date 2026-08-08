import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Dashboard from '../../pages/dashboard/Dashboard';
import Departments from '../../pages/department/Department';
import Employees from '../../pages/employee/Employees';
import LeaveRequests from '../../pages/requests/LeaveRequests';

export default function Layout() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans antialiased selection:bg-indigo-500 selection:text-white">
            {/* 1. Sidebar Navigation */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* 2. Main Shell */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <Navbar activeTab={activeTab} />

                {/* Viewport Content Container */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <div className="transition-all duration-300">
                        {activeTab === 'dashboard' && <Dashboard />}
                        {activeTab === 'departments' && <Departments />}
                        {activeTab === 'employees' && <Employees />}
                        {activeTab === 'requests' && <LeaveRequests />}
                    </div>
                </main>
            </div>
        </div>
    );
}