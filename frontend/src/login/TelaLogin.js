import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

const TelaLogin = () => {
    const [nmEmail, setNmEmail] = useState('');
    const [nmSenha, setNmSenha] = useState('');
    const [error, setError] = useState('');

    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.has('error')) {
            setError('Email ou senha inválidos. Por favor, tente novamente.');
        }
    }, [searchParams]);

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '25rem' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Login - OdontoSys</Card.Title>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form method="POST" action="/telaLogin/login">
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
                            <Button variant="primary" type="submit">
                                Entrar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TelaLogin;
