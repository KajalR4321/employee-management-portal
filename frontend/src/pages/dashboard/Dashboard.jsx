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

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [leaves, setLeaves] = useState([]);

    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null);

    // ============================
    // FETCH DASHBOARD DATA
    // ============================
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [empRes, deptRes, leaveRes] =
                    await Promise.all([
                        employeeService
                            .getAll()
                            .catch(() => ({ data: [] })),

                        departmentService
                            .getAll()
                            .catch(() => ({ data: [] })),

                        leaveService
                            .getAllLeaves()
                            .catch(() => ({ data: [] })),
                    ]);

                const employeeData = empRes.data || [];
                const departmentData = deptRes.data || [];
                const leaveData = leaveRes.data || [];

                setEmployees(employeeData);
                setDepartments(departmentData);
                setLeaves(leaveData);

                setStats({
                    totalEmployees: employeeData.length,
                    totalDepartments: departmentData.length,
                    pendingLeaves: leaveData.filter(
                        (leave) => leave.status === 'PENDING'
                    ).length,
                    approvedLeaves: leaveData.filter(
                        (leave) => leave.status === 'APPROVED'
                    ).length,
                });
            } catch (err) {
                console.error(
                    'Error fetching dashboard data:',
                    err
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // ============================
    // CLOSE MODAL
    // ============================
    const closeModal = () => {
        setActiveModal(null);
    };

    // ============================
    // ESCAPE KEY
    // ============================
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener(
                'keydown',
                handleEscape
            );
        };
    }, []);

    // ============================
    // DASHBOARD CARDS
    // ============================
    const cards = [
        {
            id: 'employees',
            title: 'Total Employees',
            value: stats.totalEmployees,
            icon: '👥',
            gradient: 'from-blue-600 to-indigo-600',
            shadow: 'shadow-indigo-500/20',
            badge: 'Active Roster',
        },
        {
            id: 'departments',
            title: 'Departments',
            value: stats.totalDepartments,
            icon: '🏢',
            gradient: 'from-violet-600 to-purple-600',
            shadow: 'shadow-purple-500/20',
            badge: 'Teams',
        },
        {
            id: 'pending',
            title: 'Pending Leaves',
            value: stats.pendingLeaves,
            icon: '⏳',
            gradient: 'from-amber-500 to-orange-600',
            shadow: 'shadow-orange-500/20',
            badge: 'Requires Action',
        },
        {
            id: 'approved',
            title: 'Approved Leaves',
            value: stats.approvedLeaves,
            icon: '✅',
            gradient: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-500/20',
            badge: 'This Month',
        },
    ];

    // ============================
    // DEPARTMENT NAME
    // ============================
    const getDepartmentName = (employee) => {
        return (
            employee?.department?.departmentName ||
            employee?.department?.name ||
            employee?.departmentName ||
            (typeof employee?.department === 'string'
                ? employee.department
                : 'Unassigned')
        );
    };

    // ============================
    // MODAL TITLE
    // ============================
    const getModalTitle = () => {
        switch (activeModal) {
            case 'employees':
                return 'Employee Roster';

            case 'departments':
                return 'All Departments';

            case 'pending':
                return 'Pending Leave Requests';

            case 'approved':
                return 'Approved Leave Requests';

            case 'apply-leave':
                return 'Apply New Leave';

            default:
                return '';
        }
    };

    // ============================
    // MODAL DESCRIPTION
    // ============================
    const getModalDescription = () => {
        switch (activeModal) {
            case 'employees':
                return `${employees.length} employees in your organization`;

            case 'departments':
                return `${departments.length} departments available`;

            case 'pending':
                return `${stats.pendingLeaves} pending leave requests`;

            case 'approved':
                return `${stats.approvedLeaves} approved leave requests`;

            case 'apply-leave':
                return 'Submit a new leave request';

            default:
                return '';
        }
    };

    return (
        <>
            {/* =====================================================
                DASHBOARD CONTENT
                IMPORTANT:
                No sticky/fixed here.
                The parent Dashboard layout should handle the
                fixed Dashboard Overview / Admin / Logout header.
            ====================================================== */}

            <div className="w-full min-h-full space-y-6 pb-8">

                {/* ============================
                    WELCOME BANNER
                ============================ */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 lg:p-8 text-white shadow-xl border border-slate-800 group">

                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">

                        <div className="min-w-0">

                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3 backdrop-blur-md">
                                System Overview
                            </span>

                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight break-words">
                                Welcome back,{' '}
                                <span className="text-indigo-400">
                                    {user?.name || 'User'}
                                </span>
                                ! 👋
                            </h2>

                            <p className="text-slate-400 text-sm mt-1 max-w-lg">
                                Here is what is happening across
                                your organization today.
                            </p>

                        </div>

                        <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-200 shrink-0">

                            Role:{' '}

                            <span className="text-indigo-300 uppercase font-bold">
                                {user?.role || 'USER'}
                            </span>

                        </div>

                    </div>
                </div>

                {/* ============================
                    METRICS CARDS
                ============================ */}
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                    {cards.map((card) => (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() =>
                                setActiveModal(card.id)
                            }
                            className="group relative bg-white text-left rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-200 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >

                            <div
                                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                            />

                            <div className="flex items-center justify-between mb-4 gap-3">

                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    {card.badge}
                                </span>

                                <div
                                    className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-gradient-to-tr ${card.gradient} text-white flex items-center justify-center text-xl shadow-lg ${card.shadow} transform transition-transform duration-300 group-hover:scale-110`}
                                >
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

                            <p className="text-xs font-semibold text-slate-500 mt-1">
                                {card.title}
                            </p>

                            <p className="text-[10px] text-indigo-500 mt-3 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to view details →
                            </p>

                        </button>
                    ))}

                </div>

                {/* ============================
                    QUICK ACTIONS + SYSTEM STATUS
                ============================ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* QUICK ACTIONS */}
                    <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">

                        <div className="flex items-center justify-between mb-4">

                            <h3 className="text-base font-bold text-slate-800">
                                Quick Actions
                            </h3>

                            <span className="text-xs text-indigo-600 font-semibold">
                                View All
                            </span>

                        </div>

                        <div className="space-y-3">

                            {/* APPLY LEAVE */}
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveModal(
                                        'apply-leave'
                                    )
                                }
                                className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50/60 rounded-2xl transition-all duration-200 group text-left border border-slate-100 hover:border-indigo-100 cursor-pointer"
                            >

                                <div className="flex items-center space-x-3 min-w-0">

                                    <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform shrink-0">
                                        ➕
                                    </span>

                                    <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 truncate">
                                        Apply New Leave Request
                                    </span>

                                </div>

                                <span className="text-slate-400 group-hover:translate-x-1 transition-transform text-xs shrink-0">
                                    ➔
                                </span>

                            </button>

                            {/* BROWSE EMPLOYEES */}
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveModal(
                                        'employees'
                                    )
                                }
                                className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-indigo-50/60 rounded-2xl transition-all duration-200 group text-left border border-slate-100 hover:border-indigo-100 cursor-pointer"
                            >

                                <div className="flex items-center space-x-3 min-w-0">

                                    <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform shrink-0">
                                        👥
                                    </span>

                                    <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 truncate">
                                        Browse Employee Roster
                                    </span>

                                </div>

                                <span className="text-slate-400 group-hover:translate-x-1 transition-transform text-xs shrink-0">
                                    ➔
                                </span>

                            </button>

                        </div>
                    </div>

                    {/* SYSTEM STATUS */}
                    <div className="bg-white p-5 sm:p-7 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">

                        <h3 className="text-base font-bold text-slate-800 mb-4">
                            Backend System Status
                        </h3>

                        <div className="space-y-4">

                            <div>

                                <div className="flex justify-between gap-3 text-xs font-bold text-slate-600 mb-1.5">

                                    <span>
                                        API Connection
                                    </span>

                                    <span className="text-emerald-600 whitespace-nowrap">
                                        Active (8000)
                                    </span>

                                </div>

                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">

                                    <div className="bg-emerald-500 h-2 rounded-full w-full animate-pulse" />

                                </div>

                            </div>

                            <div>

                                <div className="flex justify-between gap-3 text-xs font-bold text-slate-600 mb-1.5">

                                    <span>
                                        Database Sync
                                    </span>

                                    <span className="text-indigo-600 whitespace-nowrap">
                                        Connected
                                    </span>

                                </div>

                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">

                                    <div className="bg-indigo-600 h-2 rounded-full w-full" />

                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* =====================================================
                FIXED DETAILS MODAL
            ====================================================== */}
            {activeModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-sm"
                    onClick={(e) => {
                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div className="relative bg-white w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">

                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-5 border-b border-slate-100 bg-white shrink-0">

                            <div className="min-w-0">

                                <h2 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">
                                    {getModalTitle()}
                                </h2>

                                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                    {getModalDescription()}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 flex items-center justify-center transition cursor-pointer"
                            >
                                ✕
                            </button>

                        </div>

                        {/* MODAL CONTENT */}
                        <div className="flex-1 overflow-auto p-4 sm:p-6">

                            {/* EMPLOYEES */}
                            {activeModal === 'employees' && (

                                <div className="w-full">

                                    {employees.length === 0 ? (

                                        <div className="py-12 text-center text-slate-400">
                                            No employee records found.
                                        </div>

                                    ) : (

                                        <div className="overflow-x-auto rounded-2xl border border-slate-100">

                                            <table className="w-full min-w-[760px] text-left">

                                                <thead>
                                                    <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] sm:text-[11px] font-bold tracking-wider">

                                                        <th className="px-4 py-4">
                                                            ID
                                                        </th>

                                                        <th className="px-4 py-4">
                                                            Name
                                                        </th>

                                                        <th className="px-4 py-4">
                                                            Email
                                                        </th>

                                                        <th className="px-4 py-4">
                                                            Department
                                                        </th>

                                                        <th className="px-4 py-4">
                                                            Position
                                                        </th>

                                                        <th className="px-4 py-4">
                                                            Phone
                                                        </th>

                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-slate-100">

                                                    {employees.map(
                                                        (employee) => (
                                                            <tr
                                                                key={
                                                                    employee.id ||
                                                                    employee._id
                                                                }
                                                                className="hover:bg-slate-50 transition"
                                                            >

                                                                <td className="px-4 py-4 text-sm text-slate-500">
                                                                    {employee.id ||
                                                                        employee._id ||
                                                                        '-'}
                                                                </td>

                                                                <td className="px-4 py-4">

                                                                    <div className="flex items-center gap-3">

                                                                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                                                                            {employee.name
                                                                                ?.charAt(
                                                                                    0
                                                                                )
                                                                                ?.toUpperCase() ||
                                                                                'E'}
                                                                        </div>

                                                                        <span className="font-bold text-sm text-slate-800 whitespace-nowrap">
                                                                            {employee.name ||
                                                                                '-'}
                                                                        </span>

                                                                    </div>

                                                                </td>

                                                                <td className="px-4 py-4 text-sm text-slate-500">
                                                                    {employee.email ||
                                                                        '-'}
                                                                </td>

                                                                <td className="px-4 py-4">

                                                                    <span
                                                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                                            getDepartmentName(
                                                                                employee
                                                                            ) ===
                                                                            'Unassigned'
                                                                                ? 'bg-slate-100 text-slate-500'
                                                                                : 'bg-indigo-50 text-indigo-600'
                                                                        }`}
                                                                    >
                                                                        {getDepartmentName(
                                                                            employee
                                                                        )}
                                                                    </span>

                                                                </td>

                                                                <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                                                                    {employee.designation ||
                                                                        '-'}
                                                                </td>

                                                                <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">
                                                                    {employee.phone ||
                                                                        '-'}
                                                                </td>

                                                            </tr>
                                                        )
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>
                                    )}

                                </div>
                            )}

                            {/* DEPARTMENTS */}
                            {activeModal === 'departments' && (

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                                    {departments.length === 0 ? (

                                        <div className="col-span-full py-12 text-center text-slate-400">
                                            No department records found.
                                        </div>

                                    ) : (

                                        departments.map(
                                            (department) => (

                                                <div
                                                    key={
                                                        department.id ||
                                                        department._id
                                                    }
                                                    className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 transition"
                                                >

                                                    <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-xl mb-4">
                                                        🏢
                                                    </div>

                                                    <h3 className="font-bold text-slate-800">
                                                        {department.departmentName ||
                                                            department.name ||
                                                            'Unnamed Department'}
                                                    </h3>

                                                    <p className="text-sm text-slate-500 mt-2">
                                                        {department.departmentDescription ||
                                                            department.description ||
                                                            'No description available'}
                                                    </p>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>
                            )}

                            {/* PENDING LEAVES */}
                            {activeModal === 'pending' && (

                                <LeaveTable
                                    leaves={leaves.filter(
                                        (leave) =>
                                            leave.status ===
                                            'PENDING'
                                    )}
                                    emptyText="No pending leave requests."
                                />

                            )}

                            {/* APPROVED LEAVES */}
                            {activeModal === 'approved' && (

                                <LeaveTable
                                    leaves={leaves.filter(
                                        (leave) =>
                                            leave.status ===
                                            'APPROVED'
                                    )}
                                    emptyText="No approved leave requests."
                                />

                            )}

                            {/* APPLY LEAVE */}
                            {activeModal === 'apply-leave' && (

                                <div className="max-w-xl mx-auto py-4">

                                    <div className="text-center mb-6">

                                        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mb-3">
                                            📝
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-800">
                                            Apply New Leave
                                        </h3>

                                        <p className="text-sm text-slate-400 mt-1">
                                            Submit a new leave request
                                        </p>

                                    </div>

                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">

                                        <p className="text-sm text-slate-600">
                                            Use the Leave Requests page to
                                            submit and manage your leave
                                            request.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold cursor-pointer transition"
                                        >
                                            Close
                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


/* ============================================================
   LEAVE TABLE COMPONENT
============================================================ */
function LeaveTable({ leaves, emptyText }) {
    if (!leaves || leaves.length === 0) {
        return (
            <div className="py-12 text-center">

                <div className="w-14 h-14 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-2xl mb-3">
                    📋
                </div>

                <p className="text-slate-500 font-semibold">
                    {emptyText}
                </p>

            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">

            <table className="w-full min-w-[700px] text-left">

                <thead>

                    <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] sm:text-[11px] font-bold tracking-wider">

                        <th className="px-4 py-4">
                            Employee
                        </th>

                        <th className="px-4 py-4">
                            Leave Type
                        </th>

                        <th className="px-4 py-4">
                            Start Date
                        </th>

                        <th className="px-4 py-4">
                            End Date
                        </th>

                        <th className="px-4 py-4">
                            Reason
                        </th>

                        <th className="px-4 py-4">
                            Status
                        </th>

                    </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                    {leaves.map((leave) => (

                        <tr
                            key={
                                leave.id ||
                                leave._id
                            }
                            className="hover:bg-slate-50 transition"
                        >

                            <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                                {leave.employee?.name ||
                                    leave.employeeName ||
                                    'Employee'}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-600">
                                {leave.leaveType || '-'}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">
                                {leave.startDate || '-'}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">
                                {leave.endDate || '-'}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-500 max-w-[220px] truncate">
                                {leave.reason || '-'}
                            </td>

                            <td className="px-4 py-4">

                                <span
                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                        leave.status ===
                                        'APPROVED'
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-amber-50 text-amber-600'
                                    }`}
                                >
                                    {leave.status}
                                </span>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}