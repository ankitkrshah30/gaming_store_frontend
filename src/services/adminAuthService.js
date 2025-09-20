import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  
    : 'http://localhost:8080/api';

// Create separate axios instance for admin
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin request interceptor
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const adminAuthService = {
  // Admin login using your existing login endpoint
  adminLogin: async (phoneNumber, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        phoneNumber,
        password
      });

      const data = response.data;
      
      // Check if the user has admin role using your Role enum structure
      const member = data.member || data;
      const hasAdminRole = member.roles && member.roles.some(role => 
        role === 'ADMIN' || role.name === 'ADMIN' || role.authority === 'ROLE_ADMIN'
      );
      
      if (!hasAdminRole) {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Return admin-formatted response
      return {
        token: data.token,
        admin: {
          id: member.id,
          name: member.name,
          phoneNumber: member.phoneNumber,
          roles: member.roles,
          balance: member.balance
        }
      };
    } catch (error) {
      if (error.message === 'Access denied. Admin privileges required.') {
        throw error;
      }
      throw new Error(error.response?.data?.message || 'Admin login failed');
    }
  },

  // Admin logout
  adminLogout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  },

  // Check if admin is logged in
  isAdminLoggedIn: () => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    return !!(token && adminData);
  },

  // Get current admin data
  getCurrentAdmin: () => {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  },

  // Validate admin token using your validate endpoint
  validateAdminToken: async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${API_BASE_URL}/auth/validate`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      // Token invalid, logout
      adminAuthService.adminLogout();
      throw error;
    }
  }
};

export default adminApi;