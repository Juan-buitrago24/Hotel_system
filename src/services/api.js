import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  verifyAccount: (token) => {
    console.log('📡 API call - verifyAccount');
    console.log('📝 Token enviado:', token);
    console.log('🌐 URL completa:', `/auth/verify/${token}`);
    return api.get(`/auth/verify/${token}`);
  },
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password })
};

// Rooms API
export const roomsAPI = {
  getAll: (filters) => api.get('/rooms', { params: filters }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (roomData) => api.post('/rooms', roomData),
  update: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  delete: (id) => api.delete(`/rooms/${id}`),
  updateStatus: (id, status) => api.patch(`/rooms/${id}/status`, { status })
};

// Reservations API
export const reservationsAPI = {
  getAll: (filters) => api.get('/reservations', { params: filters }),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (reservationData) => api.post('/reservations', reservationData),
  update: (id, reservationData) => api.put(`/reservations/${id}`, reservationData),
  delete: (id) => api.delete(`/reservations/${id}`),
  updateStatus: (id, status) => api.patch(`/reservations/${id}/status`, { status })
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`)
};

// Dashboard API
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export default api;
