import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  
    : 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const adminService = {
  // Dashboard - matches your /admin/dashboard endpoint
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Members management - matches your /admin/members endpoints
  getAllMembers: async () => {
    const response = await api.get('/admin/members');
    return response.data;
  },

  getMemberById: async (id) => {
    const response = await api.get(`/admin/members/${id}`);
    return response.data;
  },

  deleteMember: async (memberId) => {
    const response = await api.delete(`/admin/members/${memberId}`);
    return response.data;
  },

  // Games management - matches your /admin/games endpoints
  getAllGames: async () => {
    const response = await api.get('/admin/games');
    return response.data;
  },

  addGame: async (gameData) => {
    const response = await api.post('/admin/games', gameData);
    return response.data;
  },

  deleteGame: async (gameId) => {
    const response = await api.delete(`/admin/games/${gameId}`);
    return response.data;
  },

  // Transactions - matches your /admin/transactions endpoint
  getAllTransactions: async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
  },

  // Recharges - matches your /admin/recharges endpoint
  getAllRecharges: async () => {
    const response = await api.get('/admin/recharges');
    return response.data;
  }
};