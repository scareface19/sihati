import axios from 'axios';

export const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol || 'http:';
    return `${protocol}//${hostname}:3005`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
};

export const API_BASE = getApiBase();

const api = axios.create({
  baseURL: 'http://localhost:3005',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    config.baseURL = getApiBase();
    const token = localStorage.getItem('sihati_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
