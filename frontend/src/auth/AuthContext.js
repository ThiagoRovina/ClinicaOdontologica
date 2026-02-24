import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL, AUTH_LOGIN_URL, AUTH_LOGOUT_URL } from '../config/api';

const AuthContext = createContext(null);

const normalizeUser = (data) => {
    if (!data || typeof data !== 'object') return null;
    const authorities = Array.isArray(data.authorities) ? data.authorities : [];
    return { ...data, authorities };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/usuarios/me`, { withCredentials: true });
            setUser(normalizeUser(response.data));
            return normalizeUser(response.data);
        } catch (_) {
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        refreshUser().finally(() => setLoading(false));
    }, [refreshUser]);

    const hasRole = (role) => {
        if (!user) return false;
        if (!Array.isArray(user.authorities)) return false;
        return user.authorities.some(auth => {
            if (typeof auth === 'string') return auth === role;
            return auth?.authority === role;
        });
    };

    const login = async (nmEmail, nmSenha) => {
        await axios.post(AUTH_LOGIN_URL, { nmEmail, nmSenha }, { withCredentials: true });
        await refreshUser();
    };

    const logout = async () => {
        try {
            await axios.post(AUTH_LOGOUT_URL, {}, { withCredentials: true });
        } catch (_) { }
        setUser(null);
        window.location.assign('/telaLogin');
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        hasRole,
        login,
        refreshUser,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
