export const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || '';

// If API_ORIGIN is empty, use same-origin (nginx proxy or dev proxy).
export const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

export const LOGOUT_URL = API_ORIGIN ? `${API_ORIGIN}/logout` : '/logout';

export const LOGIN_POST_URL = API_ORIGIN ? `${API_ORIGIN}/telaLogin/login` : '/telaLogin/login';

