import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoService = {
  // Read all todos (supports optional query params like ?completed=true/false&search=...)
  getAll: async (params = {}) => {
    const response = await apiClient.get('/todos/', { params });
    return response.data;
  },

  // Read single todo by ID
  getById: async (id) => {
    const response = await apiClient.get(`/todos/${id}/`);
    return response.data;
  },

  // Create new todo
  create: async (data) => {
    const response = await apiClient.post('/todos/', data);
    return response.data;
  },

  // Update existing todo (full update)
  update: async (id, data) => {
    const response = await apiClient.put(`/todos/${id}/`, data);
    return response.data;
  },

  // Partial update (e.g., toggle status)
  partialUpdate: async (id, data) => {
    const response = await apiClient.patch(`/todos/${id}/`, data);
    return response.data;
  },

  // Delete todo
  delete: async (id) => {
    const response = await apiClient.delete(`/todos/${id}/`);
    return response.data;
  },
};

export default apiClient;
