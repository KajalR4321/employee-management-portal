import API from "./API";

const leaveService = {

    applyLeave: (leaveData) =>
        API.post("/leaves", leaveData),

    getEmployeeLeaves: (employeeId) =>
        API.get(`/leaves/employee/${employeeId}`),

    getAllLeaves: () =>
        API.get("/leaves"),

    updateLeave: (leaveId, leaveData) =>
        API.put(`/leaves/${leaveId}`, leaveData),

    deleteLeave: (leaveId) =>
        API.delete(`/leaves/${leaveId}`),

    updateStatus: (leaveId, status) =>
        API.put(
            `/leaves/${leaveId}/status?status=${status}`
        ),
};

export default leaveService;