import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL, AUTH_LOGIN_URL, AUTH_LOGOUT_URL, markAuthChecking, unmarkAuthChecking } from '../config/api';

const AuthContext = createContext(null);

const normalizeUser = (data) => {
    if (!data || typeof data !== 'object') return null;
    const rawAuthorities = Array.isArray(data.authorities)
        ? data.authorities
        : Array.isArray(data.roles)
            ? data.roles
            : [];

    const authorities = rawAuthorities
        .map((authority) => {
            if (typeof authority === 'string') return authority;
            return authority?.authority;
        })
        .filter(Boolean);

    return {
        ...data,
        username: data.username || data.email || '',
        authorities
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        markAuthChecking(); // Impede o interceptor de agir
        try {
            const response = await axios.get(`${API_BASE_URL}/usuarios/me`, { withCredentials: true });
            return normalizeUser(response.data);
        } catch (_) {
            return null;
        } finally {
            unmarkAuthChecking();
        }
    }, []);

    useEffect(() => {
        let isCancelled = false;
        const init = async () => {
            const currentUser = await refreshUser();
            if (!isCancelled) {
                setUser(currentUser);
                setLoading(false);
            }
        };
        init();
        return () => { isCancelled = true; };
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
        markAuthChecking();
        try {
            await axios.post(AUTH_LOGIN_URL, { nmEmail, nmSenha }, { withCredentials: true });
            const currentUser = await refreshUser();
            setUser(currentUser);
        } finally {
            unmarkAuthChecking();
        }
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