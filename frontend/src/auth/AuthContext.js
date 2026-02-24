import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL, LOGOUT_URL } from '../config/api';

const AuthContext = createContext(null);

const normalizeUser = (data) => {
    if (!data || typeof data !== 'object') return null;
    const authorities = Array.isArray(data.authorities) ? data.authorities : [];
    return { ...data, authorities };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/usuarios/me`, { withCredentials: true })
            .then(response => {
                setUser(normalizeUser(response.data));
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const hasRole = (role) => {
        if (!user) return false;
        if (!Array.isArray(user.authorities)) return false;
        return user.authorities.some(auth => {
            if (typeof auth === 'string') return auth === role;
            return auth?.authority === role;
        });
    };

    const logout = async () => {
        try {
            await axios.post(LOGOUT_URL, {}, { withCredentials: true });
        } catch (_) { }
        setUser(null);
        window.location.href = '/telaLogin';
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        hasRole,
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
