export const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || '';

// If API_ORIGIN is empty, use same-origin (nginx proxy or dev proxy).
export const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

export const AUTH_LOGIN_URL = API_ORIGIN ? `${API_ORIGIN}/api/auth/login` : '/api/auth/login';
export const AUTH_LOGOUT_URL = API_ORIGIN ? `${API_ORIGIN}/api/auth/logout` : '/api/auth/logout';
