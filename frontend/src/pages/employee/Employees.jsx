import React, { useState, useEffect, useMemo } from 'react';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        designation: '',
        departmentName: '',
        phone: '',
        joiningDate: ''
    });

    // ==========================================
    // FETCH EMPLOYEES + DEPARTMENTS
    // ==========================================
    const fetchData = async () => {
        try {
            setLoading(true);

            const [empRes, deptRes] = await Promise.all([
                employeeService.getAll(),
                departmentService.getAll()
            ]);

            setEmployees(empRes.data || []);
            setDepartments(deptRes.data || []);

        } catch (err) {
            console.error('Error loading employee directory:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ==========================================
    // GET DEPARTMENT NAME
    // Supports both:
    // departmentName
    // department.departmentName
    // ==========================================
    const getDepartmentName = (emp) => {
        return (
            emp?.departmentName ||
            emp?.department?.departmentName ||
            emp?.department?.name ||
            (typeof emp?.department === 'string'
                ? emp.department
                : '')
        );
    };

    // ==========================================
    // SEARCH
    // ==========================================
    const filteredEmployees = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        return employees.filter((emp) => {
            const deptName = getDepartmentName(emp);

            return (
                emp.name?.toLowerCase().includes(search) ||
                emp.email?.toLowerCase().includes(search) ||
                emp.designation?.toLowerCase().includes(search) ||
                deptName?.toLowerCase().includes(search)
            );
        });
    }, [employees, searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ==========================================
    // PAGINATION
    // ==========================================
    const totalPages =
        Math.ceil(filteredEmployees.length / itemsPerPage) || 1;

    const paginatedEmployees = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;

        return filteredEmployees.slice(
            startIndex,
            startIndex + itemsPerPage
        );
    }, [filteredEmployees, currentPage]);

    // ==========================================
    // OPEN MODAL
    // ==========================================
    const handleOpenModal = (employee = null) => {
        if (employee) {
            setEditingId(employee.id || employee._id);

            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                designation: employee.designation || '',
                departmentName: getDepartmentName(employee),
                phone: employee.phone || '',
                joiningDate: employee.joiningDate || ''
            });
        } else {
            setEditingId(null);

            setFormData({
                name: '',
                email: '',
                password: '',
                designation: '',
                departmentName: '',
                phone: '',
                joiningDate: ''
            });
        }

        setShowModal(true);
    };

    // ==========================================
    // CLOSE MODAL
    // ==========================================
    const handleCloseModal = () => {
        if (!submitting) {
            setShowModal(false);
        }
    };

    // ==========================================
    // SUBMIT EMPLOYEE
    // IMPORTANT:
    // Backend EmployeeDto expects departmentName
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                designation: formData.designation,
                phone: formData.phone,
                joiningDate: formData.joiningDate,
                departmentName: formData.departmentName
            };

            console.log('Employee payload:', payload);

            if (editingId) {
                await employeeService.update(
                    editingId,
                    payload
                );
            } else {
                await employeeService.create(payload);
            }

            setShowModal(false);

            await fetchData();

        } catch (err) {
            console.error('Error saving employee:', err);

            alert(
                err.response?.data?.message ||
                'Failed to save employee record'
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ==========================================
    // DELETE
    // ==========================================
    const handleDelete = async (id) => {
        if (
            window.confirm(
                'Are you sure you want to remove this employee record?'
            )
        ) {
            try {
                await employeeService.delete(id);
                await fetchData();
            } catch (err) {
                console.error(err);
                alert('Failed to delete employee record');
            }
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-5 sm:space-y-6">

            {/* ==========================================
                HEADER
            ========================================== */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                            Employee Directory
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Showing {filteredEmployees.length} of{' '}
                            {employees.length} total staff members
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleOpenModal()}
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-5 py-3 rounded-xl sm:rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200 cursor-pointer"
                    >
                        + Add Employee
                    </button>

                </div>
            </div>

            {/* ==========================================
                SEARCH
            ========================================== */}
            <div className="relative w-full">

                <input
                    type="text"
                    placeholder="Search employee, department, email..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl sm:rounded-2xl px-4 py-3 pl-11 pr-10 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                />

                <span className="absolute left-4 top-3.5 text-slate-400">
                    🔍
                </span>

                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-3 w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-full text-xs text-slate-500 flex items-center justify-center cursor-pointer"
                    >
                        ✕
                    </button>
                )}

            </div>

            {/* ==========================================
                TABLE
            ========================================== */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                {loading ? (
                    <div className="p-10 sm:p-12 text-center">

                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />

                        <p className="text-slate-400 text-sm">
                            Fetching directory records...
                        </p>

                    </div>

                ) : filteredEmployees.length === 0 ? (

                    <div className="p-10 sm:p-16 text-center">

                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                            🔍
                        </div>

                        <h3 className="text-slate-700 font-semibold text-lg">
                            No matching profiles found
                        </h3>

                        <p className="text-slate-400 text-sm mt-1">
                            Try modifying your search keywords.
                        </p>

                    </div>

                ) : (

                    /*
                     * overflow-x-auto makes the table responsive.
                     * On small screens user can scroll horizontally.
                     */
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[700px] text-left border-collapse">

                            <thead>
                                <tr className="bg-slate-50/70 text-slate-400 uppercase text-[10px] sm:text-[11px] font-bold tracking-wider border-b border-slate-100">

                                    <th className="p-3 sm:p-4 pl-4 sm:pl-6">
                                        Member
                                    </th>

                                    <th className="p-3 sm:p-4">
                                        Department
                                    </th>

                                    <th className="p-3 sm:p-4">
                                        Designation
                                    </th>

                                    <th className="p-3 sm:p-4">
                                        Contact
                                    </th>

                                    <th className="p-3 sm:p-4 pr-4 sm:pr-6 text-right">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 text-sm">

                                {paginatedEmployees.map((emp) => {

                                    const deptDisplay =
                                        getDepartmentName(emp) ||
                                        'Unassigned';

                                    const empId =
                                        emp.id || emp._id;

                                    return (
                                        <tr
                                            key={empId}
                                            className="hover:bg-slate-50/80 transition-colors"
                                        >

                                            {/* MEMBER */}
                                            <td className="p-3 sm:p-4 pl-4 sm:pl-6">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-100 shrink-0">
                                                        {emp.name?.charAt(0)?.toUpperCase() || 'E'}
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="font-bold text-slate-800 whitespace-nowrap">
                                                            {emp.name}
                                                        </p>

                                                        <p className="text-xs text-slate-400 truncate max-w-[180px]">
                                                            {emp.email}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* DEPARTMENT */}
                                            <td className="p-3 sm:p-4">

                                                <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 whitespace-nowrap">
                                                    {deptDisplay}
                                                </span>

                                            </td>

                                            {/* DESIGNATION */}
                                            <td className="p-3 sm:p-4 text-slate-600 font-medium whitespace-nowrap">
                                                {emp.designation || 'N/A'}
                                            </td>

                                            {/* PHONE */}
                                            <td className="p-3 sm:p-4 text-slate-500 text-xs whitespace-nowrap">
                                                {emp.phone || 'N/A'}
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="p-3 sm:p-4 pr-4 sm:pr-6 text-right whitespace-nowrap">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenModal(emp)
                                                        }
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold rounded-xl transition cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(empId)
                                                        }
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold rounded-xl transition cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>
                    </div>
                )}

                {/* ==========================================
                    PAGINATION
                ========================================== */}
                {!loading && filteredEmployees.length > 0 && (

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 bg-slate-50/50 border-t border-slate-100">

                        <p className="text-xs text-slate-500 font-medium">
                            Page{' '}
                            <span className="font-bold text-slate-800">
                                {currentPage}
                            </span>{' '}
                            of{' '}
                            <span className="font-bold text-slate-800">
                                {totalPages}
                            </span>
                        </p>

                        <div className="flex items-center justify-center gap-1 sm:gap-2">

                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((page) => (

                                <button
                                    type="button"
                                    key={page}
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${currentPage === page
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {page}
                                </button>

                            ))}

                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(
                                            prev + 1,
                                            totalPages
                                        )
                                    )
                                }
                                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Next
                            </button>

                        </div>
                    </div>
                )}

            </div>

            {/* ==========================================
                MODAL
            ========================================== */}
            {showModal && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-md"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCloseModal();
                        }
                    }}
                >

                    <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg p-4 sm:p-7 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">

                        {/* MODAL HEADER */}
                        <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">

                            <div className="min-w-0">

                                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                                    {editingId
                                        ? 'Edit Employee Profile'
                                        : 'Add New Employee'}
                                </h3>

                                <p className="text-xs text-slate-400 mt-1">
                                    Fill out personal and employment details
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={submitting}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
                            >
                                ✕
                            </button>

                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            {/* NAME + EMAIL */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value
                                            })
                                        }
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        required
                                        placeholder="email@company.com"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value
                                            })
                                        }
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />
                                </div>

                            </div>

                            {/* DEPARTMENT + DESIGNATION */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                <div>

                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Department
                                    </label>

                                    <select
                                        required
                                        value={formData.departmentName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                departmentName:
                                                    e.target.value
                                            })
                                        }
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 cursor-pointer"
                                    >

                                        <option value="">
                                            Select Department
                                        </option>

                                        {departments.map(
                                            (department, index) => {

                                                const deptName =
                                                    department.departmentName ||
                                                    department.name ||
                                                    '';

                                                const deptId =
                                                    department.id ||
                                                    department._id ||
                                                    index;

                                                return (
                                                    <option
                                                        key={deptId}
                                                        value={deptName}
                                                    >
                                                        {deptName}
                                                    </option>
                                                );
                                            }
                                        )}

                                    </select>

                                </div>

                                <div>

                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Designation
                                    </label>

                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Developer"
                                        value={formData.designation}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                designation:
                                                    e.target.value
                                            })
                                        }
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />

                                </div>

                            </div>

                            {/* PHONE + DATE */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                <div>

                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Phone Number
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="10 digit phone number"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value
                                            })
                                        }
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                                    />

                                </div>

                                <div>

                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                        Joining Date
                                    </label>

                                    <input
                                        type="date"
                                        value={formData.joiningDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                joiningDate:
                                                    e.target.value
                                            })
                                        }
                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 cursor-pointer"
                                    />

                                </div>

                            </div>

                            {/* BUTTONS */}
                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting
                                        ? 'Saving...'
                                        : editingId
                                            ? 'Update Record'
                                            : 'Save Employee'}
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}