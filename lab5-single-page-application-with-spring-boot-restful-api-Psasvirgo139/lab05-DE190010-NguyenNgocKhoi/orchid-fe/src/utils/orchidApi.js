import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllOrchids = () => api.get('/orchids/');
export const getOrchidById = (id) => api.get(`/orchids/${id}`);
export const createOrchid = (data) => api.post('/orchids/', data);
export const updateOrchid = (id, data) => api.put(`/orchids/${id}`, data);
export const deleteOrchid = (id) => api.delete(`/orchids/${id}`);

export default api;
