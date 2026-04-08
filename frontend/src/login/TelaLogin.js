import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './login.css';

const IconEmail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9 6-9-6"/>
    </svg>
);
const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
    </svg>
);

const DentalIcon = () => (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5C8 5 5 8 5 12c0 3.314.429 4.5 1.5 6.5C7.571 20.5 8.5 22 9 22s1.429-1.5 2.5-3.5C12.571 16.5 13 15.314 13 12c0-4-1-5-1-7s1-4 2-4 2 2 2 4-1 4-2 5-1 1.686-1.5 0z"/>
    </svg>
);

const TelaLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [nmEmail, setNmEmail] = useState('');
    const [nmSenha, setNmSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const redirectTo = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (searchParams.has('error')) {
            setError('Email ou senha invalidos. Por favor, tente novamente.');
        }
    }, [searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(nmEmail, nmSenha);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Email ou senha invalidos. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-brilliance">
                <div className="login-glass">

                    <div className="login-brand">
                        <div className="login-brand-icon">
                            <DentalIcon />
                        </div>
                        <h2>OdontoSys</h2>
                        <p>Acesse sua conta para continuar</p>
                    </div>

                    {error && (
                        <div className="login-alert login-alert--error" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-field">
                            <label htmlFor="email">Email</label>
                            <div className="login-input-wrap">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="voce@email.com"
                                    value={nmEmail}
                                    onChange={(e) => setNmEmail(e.target.value)}
                                    required
                                />
                                <IconEmail />
                            </div>
                        </div>

                        <div className="login-field">
                            <label htmlFor="senha">Senha</label>
                            <div className="login-input-wrap">
                                <input
                                    id="senha"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    value={nmSenha}
                                    onChange={(e) => setNmSenha(e.target.value)}
                                    required
                                />
                                <IconLock />
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>

                        <div className="login-footer">
                            Clinica Odontologica &copy; {new Date().getFullYear()}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TelaLogin;
