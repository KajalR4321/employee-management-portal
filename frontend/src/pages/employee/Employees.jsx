import React, { useState, useEffect, useMemo } from 'react';
import employeeService from '../../services/employeeService';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Search & Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        designation: '',
        departmentName: '',
        phone: '',
        joiningDate: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const empRes = await employeeService.getAll();
            setEmployees(empRes.data || []);
        } catch (err) {
            console.error('Error loading employee directory', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter employees based on search term
    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            const deptName = emp.department?.departmentName || emp.department?.name || (typeof emp.department === 'string' ? emp.department : '');

            return (
                emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                deptName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [employees, searchTerm]);

    // Reset page to 1 when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Pagination calculation
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredEmployees, currentPage]);

    const handleOpenModal = (employee = null) => {
        if (employee) {
            setEditingId(employee.id || employee._id);
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                designation: employee.designation || '',
                departmentName: employee.department?.departmentName || employee.department?.name || (typeof employee.department === 'string' ? employee.department : '') || '',
                phone: employee.phone || '',
                joiningDate: employee.joiningDate || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                email: '',
                designation: '',
                department: '',
                phone: '',
                joiningDate: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            // Constructs payload using Java entity field names
            const payload = {
                name: formData.name,
                email: formData.email,
                designation: formData.designation,
                phone: formData.phone,
                joiningDate: formData.joiningDate,
                department: formData.departmentName ? { departmentName: formData.departmentName } : null
            };

            if (editingId) {
                await employeeService.update(editingId, payload);
            } else {
                await employeeService.create(payload);
            }

            setShowModal(false);
            await fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save employee record');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this employee record?')) {
            try {
                await employeeService.delete(id);
                await fetchData();
            } catch (err) {
                alert('Failed to delete employee record');
            }
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-300">
            {/* Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Employee Directory</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Showing {filteredEmployees.length} of {employees.length} total staff members
                    </p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200"
                >
                    <span>+ Add Employee</span>
                </button>
            </div>

            {/* Control Toolbar: Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by name, email, department, or designation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 pl-11 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                />
                <span className="absolute left-4 top-3.5 text-slate-400 text-sm">🔍</span>
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Main Table View */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-slate-400 text-sm font-medium">Fetching directory records...</p>
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="p-12 sm:p-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                            🔍
                        </div>
                        <h3 className="text-slate-700 font-semibold text-lg">No matching profiles found</h3>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto mt-1">
                            Try modifying your search keywords.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="bg-slate-50/70 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                                    <th className="p-4 pl-6">Member</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4">Designation</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {paginatedEmployees.map((emp) => {
                                    const deptDisplay = emp.department?.departmentName || emp.department?.name || (typeof emp.department === 'string' ? emp.department : 'Unassigned');
                                    const empId = emp.id || emp._id;

                                    return (
                                        <tr
                                            key={empId}
                                            className="hover:bg-slate-50/80 transition-colors duration-150 group"
                                        >
                                            <td className="p-4 pl-6 font-semibold text-slate-800">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm shadow-sm border border-indigo-100 shrink-0">
                                                        {emp.name?.charAt(0) || 'E'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 whitespace-nowrap">{emp.name}</p>
                                                        <p className="text-xs text-slate-400 font-normal whitespace-nowrap">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 whitespace-nowrap">
                                                    {deptDisplay}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-600 font-medium whitespace-nowrap">{emp.designation || 'N/A'}</td>
                                            <td className="p-4 text-slate-500 text-xs whitespace-nowrap">{emp.phone || 'N/A'}</td>
                                            <td className="p-4 pr-6 text-right space-x-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleOpenModal(emp)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold rounded-xl transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(empId)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold rounded-xl transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Bar */}
                {!loading && filteredEmployees.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">
                            Page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                            <span className="font-bold text-slate-800">{totalPages}</span>
                        </p>

                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-xl text-xs font-bold transition ${currentPage === page
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Employee Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                                    {editingId ? 'Edit Employee Profile' : 'Add New Employee'}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Fill out personal and employment details</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition shrink-0"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="email@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Department Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Engineering, HR, Sales"
                                        value={formData.departmentName}
                                        onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Designation</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Senior Developer"
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Joining Date</label>
                                    <input
                                        type="date"
                                        value={formData.joiningDate}
                                        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />
                                </div>
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
                                    {submitting ? 'Saving...' : editingId ? 'Update Record' : 'Save Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}