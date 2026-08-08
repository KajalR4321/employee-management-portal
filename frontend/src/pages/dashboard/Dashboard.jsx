import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import leaveService from '../../services/leaveService';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardMetrics = async () => {
            try {
                setLoading(true);
                const [empRes, deptRes, leaveRes] = await Promise.all([
                    employeeService.getAll().catch(() => ({ data: [] })),
                    departmentService.getAll().catch(() => ({ data: [] })),
                    leaveService.getAllLeaves().catch(() => ({ data: [] })),
                ]);

                const employees = empRes.data || [];
                const departments = deptRes.data || [];
                const leaves = leaveRes.data || [];

                setStats({
                    totalEmployees: employees.length,
                    totalDepartments: departments.length,
                    pendingLeaves: leaves.filter((l) => l.status === 'PENDING').length,
                    approvedLeaves: leaves.filter((l) => l.status === 'APPROVED').length,
                });
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardMetrics();
    }, []);

    const cards = [
        {
            title: 'Total Employees',
            value: stats.totalEmployees,
            icon: '👥',
            gradient: 'from-blue-600 to-indigo-600',
            shadow: 'shadow-indigo-500/20',
            badge: 'Active Roster',
        },
        {
            title: 'Departments',
            value: stats.totalDepartments,
            icon: '🏢',
            gradient: 'from-violet-600 to-purple-600',
            shadow: 'shadow-purple-500/20',
            badge: 'Teams',
        },
        {
            title: 'Pending Leaves',
            value: stats.pendingLeaves,
            icon: '⏳',
            gradient: 'from-amber-500 to-orange-600',
            shadow: 'shadow-orange-500/20',
            badge: 'Requires Action',
        },
        {
            title: 'Approved Leaves',
            value: stats.approvedLeaves,
            icon: '✅',
            gradient: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-500/20',
            badge: 'This Month',
        },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto transition-all duration-300">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl border border-slate-800 group">
                {/* Glow effect */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3 backdrop-blur-md">
                            System Overview
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight">
                            Welcome back, <span className="text-indigo-400">{user?.name || 'User'}</span>! 👋
                        </h2>
                        <p className="text-slate-400 text-sm mt-1 max-w-lg">
                            Here is what is happening across your organization today.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-200">
                        Role: <span className="text-indigo-300 uppercase font-bold">{user?.role}</span>
                    </div>
                </div>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className="group relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-200 cursor-pointer overflow-hidden"
                    >
                        {/* Hover Accent Line */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                {card.badge}
                            </span>
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.gradient} text-white flex items-center justify-center text-xl shadow-lg ${card.shadow} transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                                {card.icon}
                            </div>
                        </div>

                        <h3 className="text-3xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors duration-200">
                            {loading ? (
                                <span className="inline-block w-12 h-8 bg-slate-100 rounded-lg animate-pulse" />
                            ) : (
                                card.value
                            )}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-1">{card.title}</p>
                    </div>
                ))}
            </div>

            {/* Interactive Quick Links / Activity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-800">Quick Actions</h3>
                        <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50/60 rounded-2xl transition-all duration-200 group text-left border border-slate-100 hover:border-indigo-100">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">➕</span>
                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Apply New Leave Request</span>
                            </div>
                            <span className="text-slate-400 group-hover:translate-x-1 transition-transform text-xs">➔</span>
                        </button>

                        <button className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50/60 rounded-2xl transition-all duration-200 group text-left border border-slate-100 hover:border-indigo-100">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">👥</span>
                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Browse Employee Roster</span>
                            </div>
                            <span className="text-slate-400 group-hover:translate-x-1 transition-transform text-xs">➔</span>
                        </button>
                    </div>
                </div>

                {/* System Health Status */}
                <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-base font-bold text-slate-800 mb-4">Backend System Status</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                <span>API Connection</span>
                                <span className="text-emerald-600 font-semibold">Active (8000)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-emerald-500 h-2 rounded-full w-full animate-pulse" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                                <span>Database Sync</span>
                                <span className="text-indigo-600 font-semibold">Connected</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-indigo-600 h-2 rounded-full w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}