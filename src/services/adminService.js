import api from './authService';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  // Relative URL when served from backend
    : 'http://localhost:8080/api'; // Full URL for development

export const adminService = {
  // Get dashboard statistics
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }
};