import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Dashboard.css';

function Dashboard() {
    const { user, hasRole } = useAuth();

    const isGerente = hasRole('ROLE_GERENTE');
    const isDentista = hasRole('ROLE_DENTISTA');
    const isRecepcionista = hasRole('ROLE_RECEPCIONISTA');

    return (
        <Container className="mt-5 dashboard-container">
            <Row className="mb-4 text-center">
                <Col>
                    <h1 className="display-4">Bem-vindo ao OdontoSys</h1>
                    <p className="lead">Sistema de Gestão para Clínica Odontológica</p>
                    {user && <p className="text-muted">Olá, {user.username}!</p>}
                </Col>
            </Row>

            <Row className="g-4 justify-content-center">
                {/* Card de Agendamento - Acessível para Recepcionista e Gerente */}
                {(isRecepcionista || isGerente) && (
                    <Col md={4} sm={6}>
                        <Card className="h-100 shadow-sm dashboard-card">
                            <Card.Body className="text-center">
                                <div className="dashboard-icon">📅</div>
                                <Card.Title>Agendamento</Card.Title>
                                <Card.Text>
                                    Marque novas consultas e gerencie a agenda.
                                </Card.Text>
                                <Button as={Link} to="/agendamento" variant="primary">Acessar</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Card de Pacientes - Acessível para Recepcionista e Gerente */}
                {(isRecepcionista || isGerente) && (
                    <Col md={4} sm={6}>
                        <Card className="h-100 shadow-sm dashboard-card">
                            <Card.Body className="text-center">
                                <div className="dashboard-icon">👥</div>
                                <Card.Title>Pacientes</Card.Title>
                                <Card.Text>
                                    Cadastre e gerencie os pacientes da clínica.
                                </Card.Text>
                                <Button as={Link} to="/pacientes" variant="primary">Acessar</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Card de Consultas - Acessível para Dentista e Gerente */}
                {(isDentista || isGerente) && (
                    <Col md={4} sm={6}>
                        <Card className="h-100 shadow-sm dashboard-card">
                            <Card.Body className="text-center">
                                <div className="dashboard-icon">🩺</div>
                                <Card.Title>Minhas Consultas</Card.Title>
                                <Card.Text>
                                    Visualize e registre atendimentos.
                                </Card.Text>
                                <Button as={Link} to="/consultas" variant="primary">Acessar</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Card de Dentistas - Acessível apenas para Gerente */}
                {isGerente && (
                    <Col md={4} sm={6}>
                        <Card className="h-100 shadow-sm dashboard-card">
                            <Card.Body className="text-center">
                                <div className="dashboard-icon">👨‍⚕️</div>
                                <Card.Title>Dentistas</Card.Title>
                                <Card.Text>
                                    Gerencie o corpo clínico.
                                </Card.Text>
                                <Button as={Link} to="/dentistas" variant="primary">Acessar</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Card de Funcionários - Acessível apenas para Gerente */}
                {isGerente && (
                    <Col md={4} sm={6}>
                        <Card className="h-100 shadow-sm dashboard-card">
                            <Card.Body className="text-center">
                                <div className="dashboard-icon">👔</div>
                                <Card.Title>Funcionários</Card.Title>
                                <Card.Text>
                                    Gerencie a equipe administrativa.
                                </Card.Text>
                                <Button as={Link} to="/funcionarios" variant="primary">Acessar</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Card de Financeiro - Acessível para Gerente e Recepcionista */}
                {(isGerente || isRecepcionista) && (
                    <Col md={4} sm={6}>
                        <Card className="h-100 shadow-sm dashboard-card">
                            <Card.Body className="text-center">
                                <div className="dashboard-icon">💰</div>
                                <Card.Title>Financeiro</Card.Title>
                                <Card.Text>
                                    Controle de pagamentos e fluxo de caixa.
                                </Card.Text>
                                <Button as={Link} to="/financeiro" variant="primary">Acessar</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default Dashboard;
