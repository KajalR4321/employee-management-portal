import API from './API';

const leaveService = {
    applyLeave: (leaveData) => API.post('/leaves', leaveData),
    getEmployeeLeaves: (employeeId) => API.get(`/leaves/employee/${employeeId}`),
    getAllLeaves: () => API.get('/leaves'),
    updateStatus: (leaveId, status) => API.put(`/leaves/${leaveId}/status?status=${status}`),
};
export default leaveService;