import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackApiUrl = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : typeof window !== 'undefined'
    ? `${window.location.origin}/api`
    : '/api';

export const API_URL = (configuredApiUrl || fallbackApiUrl).replace(/\/$/, '');
export const SERVER_URL = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;

export function getAssetUrl(assetPath?: string | null) {
  if (!assetPath) {
    return '';
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${SERVER_URL}${normalizedPath}`;
}

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
  register: (id: number, data: any) => api.post(`/events/${id}/register`, data),
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
  join: (id: number, data: any) => api.post(`/ministries/${id}/join`, data),
};

export const contentAPI = {
  getBibleStudy: (fresh = false) => api.get('/content/bible-study', {
    params: fresh ? { t: Date.now() } : undefined,
    headers: fresh
      ? {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        }
      : undefined,
  }),
  joinBibleStudyWeek: (data: any) => api.post('/content/bible-study/join-week', data),
  enrollBibleStudy: (data: any) => api.post('/content/bible-study/enroll', data),
  getLiveStream: () => api.get('/content/livestream'),
  getAdminBibleStudy: () => api.get('/content/admin/bible-study'),
  updateWeeklyBibleStudy: (data: any) => api.put('/content/admin/bible-study/weekly', data),
  createBibleStudySeries: (data: any) => api.post('/content/admin/bible-study/series', data),
  updateBibleStudySeries: (id: number, data: any) => api.put(`/content/admin/bible-study/series/${id}`, data),
  deleteBibleStudySeries: (id: number) => api.delete(`/content/admin/bible-study/series/${id}`),
  createBibleStudyResource: (data: FormData) => api.post('/content/admin/bible-study/resources', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateBibleStudyResource: (id: number, data: FormData) => api.put(`/content/admin/bible-study/resources/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteBibleStudyResource: (id: number) => api.delete(`/content/admin/bible-study/resources/${id}`),
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
