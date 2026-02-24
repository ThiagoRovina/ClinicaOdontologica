import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import { API_BASE_URL } from '../config/api';

const PERFIS = [
    { value: 'ROLE_RECEPCIONISTA', label: '🗂️ Recepcionista' },
    { value: 'ROLE_DENTISTA', label: '🦷 Dentista' },
    { value: 'ROLE_GERENTE', label: '👑 Gerente' },
];

const TelaCadastro = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nmEmail: '', nmSenha: '', confirmarSenha: '', dsRole: 'ROLE_RECEPCIONISTA' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (form.nmSenha !== form.confirmarSenha) {
            setError('As senhas não coincidem.');
            return;
        }
        if (form.nmSenha.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/usuarios/registrar`, {
                nmEmail: form.nmEmail,
                nmSenha: form.nmSenha,
                dsRole: form.dsRole,
            });
            setSuccess('Usuário cadastrado com sucesso! Redirecionando...');
            setTimeout(() => navigate('/telaLogin'), 2000);
        } catch (err) {
            if (err.response?.data) {
                setError(typeof err.response.data === 'string' ? err.response.data : 'Erro ao cadastrar.');
            } else {
                setError('Erro de conexão. Verifique se o servidor está ativo.');
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
                <p className="login-card__subtitle">Crie sua conta no sistema</p>

                {error && <div className="login-alert login-alert--error">⚠️ {error}</div>}
                {success && <div className="login-alert login-alert--success">✅ {success}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label htmlFor="nmEmail">E-mail</label>
                        <input
                            id="nmEmail"
                            type="email"
                            name="nmEmail"
                            placeholder="seuemail@clinica.com"
                            value={form.nmEmail}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="dsRole">Perfil de Acesso</label>
                        <select
                            id="dsRole"
                            name="dsRole"
                            value={form.dsRole}
                            onChange={handleChange}
                            required
                        >
                            {PERFIS.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="login-field">
                        <label htmlFor="nmSenha">Senha</label>
                        <input
                            id="nmSenha"
                            type="password"
                            name="nmSenha"
                            placeholder="Mínimo 6 caracteres"
                            value={form.nmSenha}
                            onChange={handleChange}
                            required
                            minLength={6}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="confirmarSenha">Confirmar Senha</label>
                        <input
                            id="confirmarSenha"
                            type="password"
                            name="confirmarSenha"
                            placeholder="Repita a senha"
                            value={form.confirmarSenha}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Criar Conta'}
                    </button>
                </form>

                <p className="login-footer">
                    Já tem conta? <Link to="/telaLogin">Faça login</Link>
                </p>
            </div>
        </div>
    );
};

export default TelaCadastro;
