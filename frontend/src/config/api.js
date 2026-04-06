import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const devDefaultOrigin = isDevelopment ? `http://${hostname}:8080` : '';
const rawApiOrigin = process.env.REACT_APP_API_ORIGIN || devDefaultOrigin;

export const API_ORIGIN = rawApiOrigin.replace(/\/+$/, '').replace(/\/api$/, '');
export const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';
export const AUTH_LOGIN_URL = `${API_BASE_URL}/auth/login`;
export const AUTH_LOGOUT_URL = `${API_BASE_URL}/auth/logout`;

// Intercepta respostas 401 → sessão expirada → redireciona para login
// Evita loop: não faz redirect se já estiver na tela de login ou durante o carregamento do AuthContext
let _isAuthChecking = false;
export const markAuthChecking = () => { _isAuthChecking = true; };
export const unmarkAuthChecking = () => { _isAuthChecking = false; };

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && !_isAuthChecking) {
            const url = new URL(window.location.href);
            // Ignora 401 para /auth/login e já está na tela de login
            if (!url.pathname.startsWith('/telaLogin')) {
                window.location.assign('/telaLogin');
            }
        }
        return Promise.reject(error);
    }
);

// Extrai mensagem de erro legível do backend, com fallback seguro
export const extrairErro = (err, fallback = 'Ocorreu um erro inesperado.') => {
    const data = err?.response?.data;
    if (typeof data === 'string') {
        return data.substring(0, 500);
    }
    if (data?.message && typeof data.message === 'string') {
        return data.message.substring(0, 500);
    }
    if (data?.error && typeof data.error === 'string') {
        return data.error.substring(0, 500);
    }
    return fallback;
};