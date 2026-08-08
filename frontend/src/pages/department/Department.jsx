import React, { useState, useEffect } from 'react';
import departmentService from '../../services/departmentService';

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        departmentName: '',
        departmentDescription: ''
    });

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await departmentService.getAll();
            setDepartments(res.data || []);
        } catch (err) {
            console.error('Error fetching departments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setEditingId(dept.id);
            setFormData({
                departmentName: dept.departmentName || '',
                departmentDescription: dept.departmentDescription || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                departmentName: '',
                departmentDescription: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            // Payload MUST match Java Entity field names
            const payload = {
                departmentName: formData.departmentName,
                departmentDescription: formData.departmentDescription
            };

            if (editingId) {
                await departmentService.update(editingId, payload);
            } else {
                await departmentService.create(payload);
            }

            setShowModal(false);
            fetchDepartments();
        } catch (err) {
            console.error('Save error details:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Failed to save department. Ensure department name is unique.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await departmentService.delete(id);
                fetchDepartments();
            } catch (err) {
                alert('Failed to delete department.');
            }
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Departments</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Manage organizational departments</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition"
                >
                    + Add Department
                </button>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading departments...</div>
                ) : departments.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No departments found. Add one above.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-100">
                                    <th className="p-4 pl-6">ID</th>
                                    <th className="p-4">Department Name</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {departments.map((dept) => (
                                    <tr key={dept.id} className="hover:bg-slate-50/80 transition">
                                        <td className="p-4 pl-6 font-bold text-slate-500">{dept.id}</td>
                                        <td className="p-4 font-bold text-slate-800">{dept.departmentName}</td>
                                        <td className="p-4 text-slate-600">{dept.departmentDescription || 'N/A'}</td>
                                        <td className="p-4 pr-6 text-right space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(dept)}
                                                className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold rounded-xl transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dept.id)}
                                                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold rounded-xl transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">
                            {editingId ? 'Edit Department' : 'Add Department'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Department Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Engineering"
                                    value={formData.departmentName}
                                    onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Description</label>
                                <textarea
                                    placeholder="Department responsibilities..."
                                    value={formData.departmentDescription}
                                    onChange={(e) => setFormData({ ...formData, departmentDescription: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}