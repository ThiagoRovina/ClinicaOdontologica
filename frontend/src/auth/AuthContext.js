import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response = await api.get('/api/usuarios/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const hasRole = (role) => {
        if (!user) return false;
        return user.roles?.includes(role) ?? false;
    };

    const logout = async () => {
        await api.post('/logout');
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        hasRole,
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
