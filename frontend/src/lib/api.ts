import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name?: string) => 
    api.post('/auth/register', { email, password, name }),
  me: () => api.get('/auth/me'),
};

export const accountsApi = {
  list: () => api.get('/accounts'),
  get: (id: string) => api.get('/accounts/' + id),
  create: (data: { email: string; profileUrl?: string; profileName?: string }) => 
    api.post('/accounts', data),
  update: (id: string, data: any) => api.put('/accounts/' + id, data),
  delete: (id: string) => api.delete('/accounts/' + id),
};

export const campaignsApi = {
  list: (params?: { status?: string; type?: string }) => 
    api.get('/campaigns', { params }),
  get: (id: string) => api.get('/campaigns/' + id),
  create: (data: { name: string; type: string; accountId: string; settings?: any }) => 
    api.post('/campaigns', data),
  update: (id: string, data: any) => api.put('/campaigns/' + id, data),
  toggle: (id: string) => api.patch('/campaigns/' + id + '/toggle'),
  delete: (id: string) => api.delete('/campaigns/' + id),
};

export const leadsApi = {
  list: (params?: { search?: string; status?: string; page?: number; limit?: number }) => 
    api.get('/leads', { params }),
  get: (id: string) => api.get('/leads/' + id),
  create: (data: any) => api.post('/leads', data),
  update: (id: string, data: any) => api.put('/leads/' + id, data),
  connect: (id: string, message?: string) => api.post('/leads/' + id + '/connect', { message }),
  message: (id: string, message: string) => api.post('/leads/' + id + '/message', { message }),
  delete: (id: string) => api.delete('/leads/' + id),
};

export const aiApi = {
  generate: (prompt: string, type: 'post' | 'comment' | 'message') => 
    api.post('/ai/generate', { prompt, type }),
  ideas: (topic: string, count?: number) => 
    api.post('/ai/ideas', { topic, count }),
};
