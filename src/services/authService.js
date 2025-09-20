import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (name, phoneNumber, password) => {
    const response = await api.post('/auth/register', {
      name,
      phoneNumber,
      password
    });
    return response.data;
  },

  registerAdmin: async (name, phoneNumber, password) => {
    const response = await api.post('/auth/register/admin', {
      name,
      phoneNumber,
      password
    });
    return response.data;
  },

  login: async (phoneNumber, password) => {
    const response = await api.post('/auth/login', {
      phoneNumber,
      password
    });
    return response.data;
  },

  validateToken: async () => {
    try {
      const response = await api.post('/auth/validate');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
};

export default api;