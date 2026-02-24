import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './login.css';
import { LOGIN_POST_URL } from '../config/api';

const TelaLogin = () => {
    const [nmEmail, setNmEmail] = useState('');
    const [nmSenha, setNmSenha] = useState('');
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.has('error')) {
            setError('Email ou senha inválidos. Tente novamente.');
        }
        if (searchParams.has('logout')) {
            setError('');
        }
    }, [searchParams]);

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

                {/* POST nativo ao Spring Security — necessário para session cookie */}
                <form method="POST" action={LOGIN_POST_URL} className="login-form">
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

                    <button type="submit" className="login-btn">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TelaLogin;
