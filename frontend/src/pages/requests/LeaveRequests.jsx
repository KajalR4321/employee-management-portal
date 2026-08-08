import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import leaveService from '../../services/leaveService';

export default function LeaveRequests() {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: '',
        leaveType: 'CASUAL'
    });

    // Load dynamic data from Backend API
    const loadLeaves = async () => {
        try {
            setLoading(true);
            const response = user?.role === 'ADMIN'
                ? await leaveService.getAllLeaves()
                : await leaveService.getEmployeeLeaves(user?.id);
            setLeaves(response.data || []);
        } catch (err) {
            console.error('Failed to load leave records from backend', err);
        } font - medium
        {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) loadLeaves();
    }, [user]);

    // Handle Submit to Spring Boot
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await leaveService.applyLeave({
                ...formData,
                employee: { id: user.id }
            });
            setShowModal(false);
            setFormData({ startDate: '', endDate: '', reason: '', leaveType: 'CASUAL' });
            await loadLeaves();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    // Status Action Handler (Admin)
    const handleStatusUpdate = async (leaveId, status) => {
        try {
            await leaveService.updateStatus(leaveId, status);
            await loadLeaves();
        } catch (err) {
            alert('Failed to update leave status');
        }
    };

    // Dynamic Status Color Badges
    const getStatusBadge = (status) => {
        const statusMap = {
            APPROVED: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-emerald-500/10',
            REJECTED: 'bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-rose-500/10',
            PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-500/10 ring-2 ring-amber-500/20 animate-pulse'
        };
        return statusMap[status] || 'bg-slate-100 text-slate-600 border-slate-200';
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto transition-all duration-300">

            {/* Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Leave Portal</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {user?.role === 'ADMIN' ? 'Review & act on active request queues' : 'Apply for leaves and track real-time approval status'}
                    </p>
                </div>

                {user?.role === 'EMPLOYEE' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200 ease-out"
                    >
                        <span>+ New Application</span>
                    </button>
                )}
            </div>

            {/* Main Content Table Container */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-slate-400 text-sm font-medium">Fetching records from database...</p>
                    </div>
                ) : leaves.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                            🌴
                        </div>
                        <h3 className="text-slate-700 font-semibold text-lg">No leave applications found</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto mt-1">
                            There are currently no leave requests registered in the backend for this account.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                                    {user?.role === 'ADMIN' && <th className="p-4 pl-6">Employee</th>}
                                    <th className="p-4">Leave Type</th>
                                    <th className="p-4">Duration</th>
                                    <th className="p-4">Reason</th>
                                    <th className="p-4">Status</th>
                                    {user?.role === 'ADMIN' && <th className="p-4 pr-6 text-right">Approval Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {leaves.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50/80 transition-colors duration-150 group"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {user?.role === 'ADMIN' && (
                                            <td className="p-4 pl-6 font-semibold text-slate-800">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                                                        {item.employee?.name?.charAt(0) || '#'}
                                                    </div>
                                                    <span>{item.employee?.name || `Employee #${item.employee?.id}`}</span>
                                                </div>
                                            </td>
                                        )}
                                        <td className="p-4">
                                            <span className="font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-lg text-xs">
                                                {item.leaveType}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 font-medium">
                                            {item.startDate} <span className="text-slate-300 mx-1">→</span> {item.endDate}
                                        </td>
                                        <td className="p-4 text-slate-500 max-w-xs truncate">{item.reason}</td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300 shadow-sm ${getStatusBadge(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>

                                        {user?.role === 'ADMIN' && (
                                            <td className="p-4 pr-6 text-right">
                                                {item.status === 'PENDING' ? (
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(item.id, 'APPROVED')}
                                                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all duration-150"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(item.id, 'REJECTED')}
                                                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all duration-150"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-medium text-slate-400">Processed</span>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Overlay with Dynamic Slide & Fade Animation */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300">
                    <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-100 transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Apply for Leave</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Fill out your dates and justification</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                    Type of Leave
                                </label>
                                <select
                                    value={formData.leaveType}
                                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-slate-50/50"
                                >
                                    <option value="CASUAL">Casual Leave</option>
                                    <option value="SICK">Sick Leave</option>
                                    <option value="ANNUAL">Annual Leave</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-slate-50/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                    Reason for Absence
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-slate-50/50"
                                    placeholder="Provide brief details..."
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Send Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}