import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { useAuth } from '../auth/AuthContext';

const TelaLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [nmEmail, setNmEmail] = useState('');
    const [nmSenha, setNmSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(nmEmail, nmSenha);
            navigate('/');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Email ou senha inválidos. Tente novamente.');
            } else {
                setError('Erro ao autenticar. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-card__logo">🦷</div>
                <h1 className="login-card__title">OdontoSys</h1>
                <p className="login-card__subtitle">Acesse o sistema da clínica</p>

                {error && (
                    <div className="login-alert login-alert--error">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label htmlFor="nmEmail">E-mail</label>
                        <input
                            id="nmEmail"
                            type="email"
                            name="nmEmail"
                            placeholder="seuemail@clinica.com"
                            value={nmEmail}
                            onChange={(e) => setNmEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="nmSenha">Senha</label>
                        <input
                            id="nmSenha"
                            type="password"
                            name="nmSenha"
                            placeholder="••••••••"
                            value={nmSenha}
                            onChange={(e) => setNmSenha(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TelaLogin;
