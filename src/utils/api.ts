import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (data: any) => 
    api.post('/auth/register', data),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
};

// Sermons APIs
export const sermonsAPI = {
  getAll: () => api.get('/sermons'),
  getById: (id: number) => api.get(`/sermons/${id}`),
  create: (data: FormData) => api.post('/sermons', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put(`/sermons/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/sermons/${id}`),
};

// Events APIs
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: FormData) => api.post('/events', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put(`/events/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/events/${id}`),
};

// Gallery APIs
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  getByCategory: (category: string) => api.get(`/gallery/category/${category}`),
  upload: (data: FormData) => api.post('/gallery', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/gallery/${id}`),
};

// Blog APIs
export const blogAPI = {
  getAll: () => api.get('/blog'),
  getById: (id: number) => api.get(`/blog/${id}`),
  create: (data: FormData) => api.post('/blog', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: number, data: FormData) => api.put(`/blog/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/blog/${id}`),
};

// Prayer Requests APIs
export const prayerRequestsAPI = {
  getAll: () => api.get('/prayer-requests/all'),
  create: (data: any) => api.post('/prayer-requests', data),
  updateStatus: (id: number, status: string) => 
    api.patch(`/prayer-requests/${id}`, { status }),
  delete: (id: number) => api.delete(`/prayer-requests/${id}`),
};

// Donations APIs
export const donationsAPI = {
  getAll: () => api.get('/donations/all'),
  create: (data: any) => api.post('/donations', data),
};

// Ministries APIs
export const ministriesAPI = {
  getAll: () => api.get('/ministries'),
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getEvents: () => api.get('/dashboard/events'),
  getAttendance: () => api.get('/dashboard/attendance'),
  getGiving: () => api.get('/dashboard/giving'),
  getDepartments: () => api.get('/dashboard/departments'),
};

// Members/Users APIs
export const membersAPI = {
  getAll: () => api.get('/auth/users'),
};

export default api;
