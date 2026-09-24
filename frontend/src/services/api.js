import axios from 'axios';

const getBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || '';
  if (!envUrl) {
    // In production without explicit URL, default to relative /api or production backend
    return import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';
  }
  let cleanUrl = String(envUrl).trim().replace(/\/+$/, '');
  // If host provided without protocol (e.g. from Render blueprint property: host)
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('/')) {
    cleanUrl = `https://${cleanUrl}`;
  }
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT bearer token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('campus_token');
        localStorage.removeItem('campus_user');
      }
    }
    return Promise.reject(error);
  }
);

// Generic placeholder vector avatar (no real person photo)
export const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

// Helper to resolve static uploads (assignments, study materials, avatars)
export const getFileUrl = (relativePath) => {
  if (!relativePath) return DEFAULT_AVATAR;
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  const base = getBaseUrl().replace(/\/api\/?$/, '');
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${base}${cleanPath}`;
};

export default API;
