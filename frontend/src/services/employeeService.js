import API from './API';

const employeeService = {
    getAll: () => API.get('/employees'),
    getById: (id) => API.get(`/employees/${id}`),
    create: (employeeData) => API.post('/employees', employeeData),
    update: (id, employeeData) => API.put(`/employees/${id}`, employeeData),
    delete: (id) => API.delete(`/employees/${id}`),
};
export default employeeService;