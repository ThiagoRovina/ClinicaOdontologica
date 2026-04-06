import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../auth/AuthContext';

const TelaLogin = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [nmEmail, setNmEmail] = useState('');
    const [nmSenha, setNmSenha] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.has('error')) {
            setError('Email ou senha inválidos. Por favor, tente novamente.');
        }
    }, [searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/api/auth/login', { nmEmail, nmSenha });

            await refreshUser();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Email ou senha invalidos. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (

        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '25rem' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Login - OdontoSys</Card.Title>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="nmEmail"
                                placeholder="Digite seu email"
                                value={nmEmail}
                                onChange={(e) => setNmEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                name="nmSenha"
                                placeholder="Digite sua senha"
                                value={nmSenha}
                                onChange={(e) => setNmSenha(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TelaLogin;
