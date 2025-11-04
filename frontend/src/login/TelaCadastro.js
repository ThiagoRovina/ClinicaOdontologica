import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

const TelaCadastro = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({ nmEmail: '', nmSenha: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await axios.post(`${API_BASE_URL}/usuarios/registrar`, usuario);
            setSuccess("Usuário cadastrado com sucesso! Você será redirecionado para o login.");
            setTimeout(() => navigate('/telaLogin'), 2000);
        } catch (err) {
            console.error("Erro ao registrar usuário:", err);
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Erro ao registrar usuário. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '25rem' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Criar Conta - OdontoSys</Card.Title>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="nmEmail"
                                placeholder="Digite seu email"
                                value={usuario.nmEmail}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                name="nmSenha"
                                placeholder="Crie uma senha"
                                value={usuario.nmSenha}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Registrando...' : 'Registrar'}
                            </Button>
                        </div>
                    </Form>
                    <div className="text-center mt-3">
                        Já tem uma conta? <Link to="/telaLogin">Faça login</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TelaCadastro;
