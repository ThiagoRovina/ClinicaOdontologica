import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import api from "./api";
import PageHeader from "./components/PageHeader";
import StatsCard from "./components/StatsCard";

function Home() {
    const { user, hasRole } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const quickActions = [
        {
            title: 'Pacientes',
            description: 'Cadastro, busca e atualizacao de dados dos pacientes.',
            to: '/pacientes',
            enabled: hasRole('ROLE_ADMINISTRATIVO') || hasRole('ROLE_GERENTE')
        },
        {
            title: 'Dentistas',
            description: 'Gerencie profissionais, CROs e especialidades.',
            to: '/dentistas',
            enabled: hasRole('ROLE_GERENTE')
        },
        {
            title: 'Agenda',
            description: 'Agende novos atendimentos e acompanhe a operacao do dia.',
            to: '/agendamento',
            enabled: hasRole('ROLE_ADMINISTRATIVO') || hasRole('ROLE_GERENTE')
        },
        {
            title: 'Consultas',
            description: 'Visualize o calendario e os agendamentos do dia.',
            to: '/consultas',
            enabled: hasRole('ROLE_DENTISTA') || hasRole('ROLE_GERENTE')
        }
    ];

    useEffect(() => {
        api.get('/api/dashboard/summary')
            .then((response) => setSummary(response.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Painel principal"
                title="Visao geral da clinica"
                subtitle={`Sessao ativa para ${user?.email}. Use o painel para acompanhar operacao, equipe e agenda.`}
                actions={<Badge bg="light" text="dark" className="status-badge">Perfil ativo</Badge>}
            />

            {loading ? (
                <div className="loading-shell">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row className="g-4 mb-4">
                    <Col lg={4} md={6}><StatsCard label="Pacientes" value={summary?.totalPacientes ?? 0} helper="base cadastrada" accent="blue" /></Col>
                    <Col lg={4} md={6}><StatsCard label="Dentistas" value={summary?.totalDentistas ?? 0} helper="profissionais ativos" accent="green" /></Col>
                    <Col lg={4} md={6}><StatsCard label="Funcionarios" value={summary?.totalFuncionarios ?? 0} helper="equipe interna" accent="sand" /></Col>
                    <Col lg={4} md={6}><StatsCard label="Consultas hoje" value={summary?.consultasHoje ?? 0} helper="movimento do dia" accent="coral" /></Col>
                    <Col lg={4} md={6}><StatsCard label="Agendadas" value={summary?.consultasAgendadas ?? 0} helper="fila atual" accent="navy" /></Col>
                    <Col lg={4} md={6}><StatsCard label="Canceladas" value={summary?.consultasCanceladas ?? 0} helper="acompanhe perdas" accent="rose" /></Col>
                </Row>
            )}

            <Card className="surface-card">
                <Card.Body>
                    <div className="section-heading-row">
                        <div>
                            <span className="eyebrow">Acessos rapidos</span>
                            <h2 className="section-title mb-2">Modulos disponiveis para o seu perfil</h2>
                        </div>
                    </div>
                    <Row className="g-4">
                        {quickActions.filter((item) => item.enabled).map((card) => (
                            <Col md={6} key={card.title}>
                                <Card className="quick-card h-100">
                                    <Card.Body>
                                        <Card.Title>{card.title}</Card.Title>
                                        <Card.Text>{card.description}</Card.Text>
                                        <Button as={Link} to={card.to} variant="dark" className="rounded-pill px-4">
                                            Abrir modulo
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Home;
