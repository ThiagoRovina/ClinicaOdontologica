import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge, Table } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';
import { API_BASE_URL } from '../config/api';
import { formatarMoeda } from '../ultilitarios/ultilitarios';
import './Dashboard.css';
import axios from 'axios';

const KPI_CARD = ({ titulo = '', valor, icone, cor = '#0d6efd', subtitulo = '' }) => (
    <Card className="h-100 shadow-sm dashboard-kpi" style={{ borderTop: `3px solid ${cor}` }}>
        <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <p className="text-muted mb-1 dashboard-kpi__label">{titulo}</p>
                    <h3 className="mb-0 dashboard-kpi__valor" style={{ color: cor }}>{valor}</h3>
                    {subtitulo && <p className="text-muted mb-0 mt-1 small">{subtitulo}</p>}
                </div>
                <div className="dashboard-kpi__icone" style={{ color: cor }}>{icone}</div>
            </div>
        </Card.Body>
    </Card>
);

function Dashboard() {
    const { user, hasRole } = useAuth();
    const displayName = user?.nome || user?.username;

    const isGerente = hasRole('ROLE_GERENTE');
    const isDentista = hasRole('ROLE_DENTISTA');
    const isRecepcionista = hasRole('ROLE_RECEPCIONISTA');

    // Dados dinâmicos do dashboard
    const [consultasHoje, setConsultasHoje] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const promises = [];

        // Consultas de hoje
        if (isDentista || isGerente) {
            promises.push(
                axios.get(`${API_BASE_URL}/consultas/hoje`)
                    .then(r => setConsultasHoje(r.data))
                    .catch(() => {})
            );
        }

        // Dados para Gerente e Recepcionista
        if (isGerente || isRecepcionista) {
            promises.push(
                axios.get(`${API_BASE_URL}/financeiro/lancamentos`)
                    .then(r => {
                        const lancamentos = r.data;
                        const receita = lancamentos
                            .filter(l => l.tipo === 'RECEITA' && l.status === 'PAGO')
                            .reduce((sum, l) => sum + (parseFloat(l.valor) || 0), 0);
                        const despesa = lancamentos
                            .filter(l => l.tipo === 'DESPESA' && l.status === 'PAGO')
                            .reduce((sum, l) => sum + (parseFloat(l.valor) || 0), 0);
                        setStats({ receita, despesa, saldo: receita - despesa });
                    })
                    .catch(() => {})
            );
            // Total pacientes
            promises.push(
                axios.get(`${API_BASE_URL}/pacientes`)
                    .then(r => setStats(prev => ({ ...prev, totalPacientes: r.data.length })))
                    .catch(() => {})
            );
            // Total consultas
            promises.push(
                axios.get(`${API_BASE_URL}/consultas`)
                    .then(r => {
                        setStats(prev => ({ ...prev, totalConsultas: r.data.length }));
                    })
                    .catch(() => {})
            );
        }

        if (promises.length === 0) {
            setLoading(false);
        } else {
            Promise.allSettled(promises).finally(() => setLoading(false));
        }
    }, [isGerente, isDentista, isRecepcionista]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <Spinner animation="border" style={{ color: '#6C63FF' }} />
                <span className="ms-3 text-muted">Carregando dashboard...</span>
            </div>
        );
    }

    return (
        <Container className="dashboard-container py-4 px-3 px-md-4">
            {/* Saudação */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">
                    Olá, {displayName || 'Visitante'}!
                </h2>
                <p className="text-muted mb-0">
                    {new Date().toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </p>
            </div>

            {/* KPIs */}
            {(isGerente || isRecepcionista) && (
                <Row className="g-3 mb-4">
                    <Col sm={6} xl={3}>
                        <KPI_CARD
                            titulo="Total de Pacientes"
                            valor={stats?.totalPacientes || 0}
                            icone={<DenteIcon />}
                            cor="#6366F1"
                        />
                    </Col>
                    <Col sm={6} xl={3}>
                        <KPI_CARD
                            titulo="Consultas Hoje"
                            valor={consultasHoje.length || 0}
                            subtitulo={stats?.totalConsultas ? `de ${stats.totalConsultas} no total` : ''}
                            icone={<CalendarioIcon />}
                            cor="#0EA5E9"
                        />
                    </Col>
                    <Col sm={6} xl={3}>
                        <KPI_CARD
                            titulo="Receita (Pago)"
                            valor={formatarMoeda(stats?.receita || 0)}
                            icone={<ReceitaIcon />}
                            cor="#10B981"
                        />
                    </Col>
                    <Col sm={6} xl={3}>
                        <KPI_CARD
                            titulo="Saldo Financeiro"
                            valor={formatarMoeda(stats?.saldo || 0)}
                            icone={<SaldoIcon />}
                            cor={stats?.saldo >= 0 ? '#10B981' : '#EF4444'}
                        />
                    </Col>
                </Row>
            )}

            {(isDentista && !isGerente && !isRecepcionista) && (
                <Row className="g-3 mb-4">
                    <Col sm={6} xl={3}>
                        <KPI_CARD
                            titulo="Consultas Hoje"
                            valor={consultasHoje.length || 0}
                            icone={<CalendarioIcon />}
                            cor="#0EA5E9"
                        />
                    </Col>
                </Row>
            )}

            {/* Consultas de Hoje */}
            {(isDentista || isGerente || isRecepcionista) && (
                <Row className="mb-4">
                    {(isDentista || isGerente) && (
                        <Col>
                            <Card className="shadow-sm">
                                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-semibold">Agendamentos de Hoje</h5>
                                    <Link to="/consultas/hoje" className="btn btn-sm btn-outline-primary">Ver todos</Link>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    {consultasHoje.length > 0 ? (
                                        <Table className="mb-0" hover responsive>
                                            <thead>
                                                <tr>
                                                    <th className="ps-3">Horário</th>
                                                    <th>Paciente</th>
                                                    <th>Dentista</th>
                                                    <th className="pe-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {consultasHoje.slice(0, 5).map(c => (
                                                    <tr key={c.idConsulta}>
                                                        <td className="ps-3 fw-medium">
                                                            {new Date(c.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </td>
                                                        <td>{c.paciente.nome}</td>
                                                        <td>{c.dentista.nome}</td>
                                                        <td className="pe-3">
                                                            <Badge bg={statusCor(c.status)}>{statusLabel(c.status)}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            <div style={{ fontSize: '2.5rem' }}>&#128197;</div>
                                            <p className="mb-0">Nenhum agendamento para hoje.</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                    {(isRecepcionista && !isDentista && !isGerente) && (
                        <Col>
                            <Card className="shadow-sm">
                                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-semibold">Agendamentos de Hoje</h5>
                                    <Link to="/agendamento" className="btn btn-sm btn-outline-primary">Novo Agendamento</Link>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    {consultasHoje.length > 0 ? (
                                        <Table className="mb-0" hover responsive>
                                            <thead>
                                                <tr>
                                                    <th className="ps-3">Horário</th>
                                                    <th>Paciente</th>
                                                    <th>Dentista</th>
                                                    <th className="pe-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {consultasHoje.slice(0, 5).map(c => (
                                                    <tr key={c.idConsulta}>
                                                        <td className="ps-3 fw-medium">
                                                            {new Date(c.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </td>
                                                        <td>{c.paciente.nome}</td>
                                                        <td>{c.dentista.nome}</td>
                                                        <td className="pe-3">
                                                            <Badge bg={statusCor(c.status)}>{statusLabel(c.status)}</Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            <div style={{ fontSize: '2.5rem' }}>&#128197;</div>
                                            <p className="mb-0">Nenhum agendamento para hoje.</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            )}

            {/* Cards de Acesso Rápido */}
            <Row className="g-3">
                {(isRecepcionista || isGerente) && (
                    <Col sm={6} md={4} xl={3}>
                        <DashboardCard
                            to="/agendamento"
                            icon={<CalendarAltIcon />}
                            title="Agendar Consulta"
                            description="Marque novas consultas e gerencie a agenda"
                            color="#6366F1"
                        />
                    </Col>
                )}
                {(isRecepcionista || isGerente) && (
                    <Col sm={6} md={4} xl={3}>
                        <DashboardCard
                            to="/pacientes"
                            icon={<UserGroupIcon />}
                            title="Pacientes"
                            description="Cadastre e gerencie os pacientes"
                            color="#0EA5E9"
                        />
                    </Col>
                )}
                {(isDentista || isGerente) && (
                    <Col sm={6} md={4} xl={3}>
                        <DashboardCard
                            to="/consultas"
                            icon={<ClipboardCheckIcon />}
                            title="Minhas Consultas"
                            description="Visualize e registre atendimentos"
                            color="#10B981"
                        />
                    </Col>
                )}
                {isGerente && (
                    <Col sm={6} md={4} xl={3}>
                        <DashboardCard
                            to="/dentistas"
                            icon={<StethoscopeIcon />}
                            title="Dentistas"
                            description="Gerencie o corpo clínico"
                            color="#F59E0B"
                        />
                    </Col>
                )}
                {isGerente && (
                    <Col sm={6} md={4} xl={3}>
                        <DashboardCard
                            to="/funcionarios"
                            icon={<BuildingOfficeIcon />}
                            title="Funcionários"
                            description="Gerencie a equipe administrativa"
                            color="#EC4899"
                        />
                    </Col>
                )}
                {isGerente && (
                    <Col sm={6} md={4} xl={3}>
                        <DashboardCard
                            to="/procedimentos"
                            icon={<WrenchIcon />}
                            title="Procedimentos"
                            description="Catálogo de tratamentos e valores"
                            color="#8B5CF6"
                        />
                    </Col>
                )}
                {(isGerente || isRecepcionista) && (
                    <Col sm={6} md={4} xl={3}>
                        <DashboardCard
                            to="/financeiro"
                            icon={<CurrencyIcon />}
                            title="Financeiro"
                            description="Controle de pagamentos e fluxo de caixa"
                            color="#EF4444"
                        />
                    </Col>
                )}
            </Row>
        </Container>
    );
}

// Card de acesso rápido reutilizável
function DashboardCard({ to, icon, title, description, color }) {
    return (
        <Link to={to} className="text-decoration-none" style={{ height: '100%' }}>
            <Card className="h-100 shadow-sm dashboard-link-card"
                style={{ borderLeft: `3px solid ${color}` }}>
                <Card.Body className="d-flex align-items-center gap-3">
                    <div className="dashboard-link-icon" style={{ color, backgroundColor: `${color}15` }}>
                        {icon}
                    </div>
                    <div>
                        <h6 className="mb-1 fw-semibold" style={{ color: '#111827' }}>{title}</h6>
                        <p className="mb-0 text-muted small">{description}</p>
                    </div>
                </Card.Body>
            </Card>
        </Link>
    );
}

// Status helpers
function statusCor(status) {
    const map = { AGENDADA: 'info', FINALIZADA: 'success', CANCELADA: 'danger' };
    return map[status] || 'secondary';
}

function statusLabel(status) {
    const map = { AGENDADA: 'Agendada', FINALIZADA: 'Finalizada', CANCELADA: 'Cancelada' };
    return map[status] || status;
}

// SVG Icons inline
function DenteIcon() {
    return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 8v4M10 10l4 4" /></svg>;
}
function CalendarioIcon() {
    return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function ReceitaIcon() {
    return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
}
function SaldoIcon() {
    return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 20l5-5 4 4 11-11" /></svg>;
}
function CalendarAltIcon() {
    return <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function UserGroupIcon() {
    return <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4" /><path d="M17 17v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1M15 7a4 4 0 010 8M15 17v-3a3 3 0 016 0v3" /></svg>;
}
function ClipboardCheckIcon() {
    return <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 12l2 2 4-4" /></svg>;
}
function StethoscopeIcon() {
    return <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3" /><path d="M12 13v3a3 3 0 016 0v1a3 3 0 01-6 0v-3" /></svg>;
}
function BuildingOfficeIcon() {
    return <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 8h1M13 8h1M9 12h1M13 12h1M9 16h1M13 16h1M17 16v5H7V3" /></svg>;
}
function WrenchIcon() {
    return <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94L6.73 20.4a1 1 0 01-1.73 0 1 1 0 010-1.73l6.93-6.93A6 6 0 0114.7 6.3z" /></svg>;
}
function CurrencyIcon() {
    return <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
}

export default Dashboard;
