const isDevelopment = process.env.NODE_ENV === 'development';
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const devDefaultOrigin = isDevelopment ? `http://${hostname}:8080` : '';
const rawApiOrigin = process.env.REACT_APP_API_ORIGIN || devDefaultOrigin;

// Accept either "...", ".../" or ".../api" to avoid duplicated "/api/api" paths.
export const API_ORIGIN = rawApiOrigin.replace(/\/+$/, '').replace(/\/api$/, '');

// If API_ORIGIN is empty, use same-origin (nginx proxy or dev proxy).
export const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

export const AUTH_LOGIN_URL = `${API_BASE_URL}/auth/login`;
export const AUTH_LOGOUT_URL = `${API_BASE_URL}/auth/logout`;
