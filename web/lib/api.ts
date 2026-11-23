import axios from 'axios';

export const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol || 'http:';

    // Détection cloud automatique sur Render
    if (hostname.includes('onrender.com')) {
      return 'https://sihati-backend-cv2q.onrender.com';
    }

    // Environnement local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:3005`;
    }

    return `${protocol}//${hostname}:3005`;
  }
  return 'http://localhost:3005';
};

export const API_BASE = getApiBase();

const api = axios.create({
  baseURL: getApiBase(),
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
