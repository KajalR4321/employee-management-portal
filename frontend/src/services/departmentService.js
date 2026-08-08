import API from './API';

const departmentService = {
  getAll: () => API.get('/departments'),
  getById: (id) => API.get(`/departments/${id}`),
  create: (data) => API.post('/departments', data),
  update: (id, data) => API.put(`/departments/${id}`, data),
  delete: (id) => API.delete(`/departments/${id}`),
};
export default departmentService;