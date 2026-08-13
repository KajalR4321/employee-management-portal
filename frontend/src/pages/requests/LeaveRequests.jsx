import React, { useEffect, useState } from "react";
import leaveService from "../../services/leaveService";
import { useAuth } from "../../context/AuthContext";
const LeaveRequests = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingLeave, setEditingLeave] = useState(null);

    const [formData, setFormData] = useState({
        leaveType: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
    });

    // =====================================================
    // GET LEAVES
    // =====================================================

    const loadLeaves = async () => {
        try {
            setLoading(true);
            setError("");

            let response;

            if (user?.role?.toUpperCase() === "ADMIN") {
                response = await leaveService.getAllLeaves();
            } else {
                response = await leaveService.getEmployeeLeaves(user?.id);
            }

            console.log("Leave response:", response.data);

            setLeaves(response.data || []);

        } catch (err) {
            console.error("Leave loading error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to fetch leave records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            loadLeaves();
        } else {
            setLoading(false);
            setError("User information not found.");
        }
    }, [user]);

    // =====================================================
    // OPEN NEW LEAVE FORM
    // =====================================================

    const openApplyForm = () => {
        setEditingLeave(null);

        setFormData({
            leaveType: "CASUAL",
            startDate: "",
            endDate: "",
            reason: "",
        });

        setShowModal(true);
    };

    // =====================================================
    // OPEN EDIT FORM
    // =====================================================

    const openEditForm = (leave) => {
        if (leave.status !== "PENDING") {
            alert("Only pending leave can be edited.");
            return;
        }

        setEditingLeave(leave);

        setFormData({
            leaveType: leave.leaveType || "CASUAL",
            startDate: leave.startDate || "",
            endDate: leave.endDate || "",
            reason: leave.reason || "",
        });

        setShowModal(true);
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeModal = () => {
        if (submitting) return;

        setShowModal(false);
        setEditingLeave(null);

        setFormData({
            leaveType: "CASUAL",
            startDate: "",
            endDate: "",
            reason: "",
        });
    };

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =====================================================
    // APPLY / UPDATE LEAVE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.startDate || !formData.endDate) {
            alert("Please select start date and end date.");
            return;
        }

        if (formData.endDate < formData.startDate) {
            alert("End date cannot be before start date.");
            return;
        }

        if (!formData.reason.trim()) {
            alert("Please enter a reason.");
            return;
        }

        try {
            setSubmitting(true);

            // Resolve employeeId from whichever key the login response
            // actually uses, and block submission early with a clear
            // message if it's still missing.
            const employeeId =
                user?.id ?? user?.employeeId ?? user?.userId ?? user?._id;

            console.log("USER:", user);
            console.log("EMPLOYEE ID:", employeeId);

            if (!employeeId) {
                alert("Employee ID missing. Please log out and log in again.");
                setSubmitting(false);
                return;
            }

            const payload = {
                employeeId: employeeId,
                leaveType: formData.leaveType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason.trim(),
            };

            console.log("Leave payload:", payload);

            if (editingLeave) {
                await leaveService.updateLeave(
                    editingLeave.id,
                    payload
                );
            } else {
                await leaveService.applyLeave(payload);
            }

            closeModal();

            await loadLeaves();

        } catch (err) {
            console.error("========== LEAVE ERROR ==========");
            console.error("Error:", err);
            console.error("Status:", err.response?.status);
            console.error("Response:", JSON.stringify(err.response?.data, null, 2));
            console.error("Message:", err.response?.data?.message);
            console.error("=================================");

            alert(
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.response?.data?.details ||
                err.message ||
                "Unable to save leave request."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (leaveId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this leave request?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await leaveService.deleteLeave(leaveId);

            await loadLeaves();

        } catch (err) {
            console.error("Delete error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to delete leave request."
            );
        } finally {
            setDeleting(false);
        }
    };

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-700 border border-green-200";

            case "REJECTED":
                return "bg-red-100 text-red-700 border border-red-200";

            default:
                return "bg-yellow-100 text-yellow-700 border border-yellow-200";
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
                    <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
                    <p className="text-slate-500 text-sm">
                        Fetching records from database...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Leave Portal
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Manage your leave requests and check their status.
                            </p>
                        </div>
                        <button
                            onClick={openApplyForm}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-violet-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                        >
                            <span className="text-xl leading-none">+</span>
                            Apply New Leave
                        </button>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 flex flex-col sm:flex-row sm:items-center gap-3">
                        <p className="text-sm flex-1">
                            <span className="font-semibold">Error:</span> {error}
                        </p>
                        <button
                            onClick={loadLeaves}
                            className="rounded-lg bg-white border border-red-200 px-4 py-2 text-sm font-semibold hover:bg-red-100"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* QUICK ACTIONS */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
                        <button
                            onClick={openApplyForm}
                            className="text-sm font-medium text-violet-600 hover:text-violet-800"
                        >
                            View All
                        </button>
                    </div>
                    <button
                        onClick={openApplyForm}
                        className="w-full flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5 text-left transition-all duration-200 hover:bg-violet-50 hover:border-violet-200 hover:-translate-y-0.5 hover:shadow-sm group"
                    >
                        <div className="h-11 w-11 shrink-0 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-2xl font-semibold transition-transform group-hover:scale-110">
                            +
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-900">Apply New Leave Request</p>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Create a new leave request</p>
                        </div>
                        <span className="text-xl text-slate-400 transition-transform group-hover:translate-x-1">→</span>
                    </button>
                </div>

                {/* SUMMARY */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-2xl font-bold text-slate-900">
                            {leaves.filter((leave) => leave.status === "PENDING").length}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">Pending</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-2xl font-bold text-green-600">
                            {leaves.filter((leave) => leave.status === "APPROVED").length}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">Approved</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-2xl font-bold text-red-600">
                            {leaves.filter((leave) => leave.status === "REJECTED").length}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">Rejected</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <p className="text-2xl font-bold text-violet-600">{leaves.length}</p>
                        <p className="mt-1 text-sm text-slate-500">Total</p>
                    </div>
                </div>

                {/* LEAVE REQUESTS */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">My Leave Requests</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {leaves.length} request{leaves.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <button
                            onClick={loadLeaves}
                            className="self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    {leaves.length === 0 ? (
                        <div className="py-14 text-center">
                            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-violet-50 flex items-center justify-center text-3xl">
                                📋
                            </div>
                            <h3 className="font-bold text-slate-900">No Leave Requests</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                You haven't submitted any leave request yet.
                            </p>
                            <button
                                onClick={openApplyForm}
                                className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition"
                            >
                                + Apply New Leave
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {leaves.map((leave) => (
                                <div
                                    key={leave.id}
                                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:bg-white"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="h-11 w-11 shrink-0 rounded-xl bg-violet-100 flex items-center justify-center text-xl">
                                                {leave.leaveType === "SICK"
                                                    ? "🏥"
                                                    : leave.leaveType === "EARNED"
                                                        ? "🌴"
                                                        : "📅"}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-bold text-slate-900">
                                                        {leave.leaveType} Leave
                                                    </h3>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(leave.status)}`}
                                                    >
                                                        {leave.status}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm text-slate-600">
                                                    {leave.startDate} {" → "} {leave.endDate}
                                                </p>
                                                <p className="mt-1 text-sm text-slate-500 break-words">
                                                    {leave.reason}
                                                </p>
                                            </div>
                                        </div>

                                        {leave.status === "PENDING" && (
                                            <div className="flex gap-2 lg:shrink-0">
                                                <button
                                                    onClick={() => openEditForm(leave)}
                                                    className="flex-1 lg:flex-none rounded-lg bg-violet-100 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-200 transition"
                                                >
                                                    ✏ Edit
                                                </button>
                                                <button
                                                    disabled={deleting}
                                                    onClick={() => handleDelete(leave.id)}
                                                    className="flex-1 lg:flex-none rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-200 disabled:opacity-50 transition"
                                                >
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-[modalIn_0.25s_ease-out]">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {editingLeave ? "Edit Leave Request" : "Apply New Leave Request"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Fill in your leave details below.
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="h-9 w-9 shrink-0 rounded-full bg-slate-100 text-xl text-slate-500 hover:bg-slate-200 transition"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Leave Type
                                </label>
                                <select
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                >
                                    <option value="CASUAL">Casual Leave</option>
                                    <option value="SICK">Sick Leave</option>
                                    <option value="EARNED">Earned Leave</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        min={formData.startDate || new Date().toISOString().split("T")[0]}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">
                                    Reason
                                </label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                    placeholder="Enter reason for leave..."
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="w-full sm:w-auto rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition"
                                >
                                    {submitting ? "Saving..." : editingLeave ? "Update Leave" : "Submit Leave"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveRequests;