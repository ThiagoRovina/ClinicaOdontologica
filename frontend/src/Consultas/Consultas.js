import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import './CalendarStyles.css';
import api from '../api';
import PageHeader from '../components/PageHeader';

const Consultas = () => {
    const navigate = useNavigate();
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/api/consultas')
            .then(response => {
                setConsultas(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar consultas", error);
                setError("Nao foi possivel carregar o calendario de consultas.");
                setLoading(false);
            });
    }, []);

    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            const diaString = date.toISOString().split('T')[0];
            const consultasNoDia = consultas.filter(c => c.dataHora.startsWith(diaString));

            if (consultasNoDia.length === 0) return null;

            const temCancelada = consultasNoDia.some(c => c.status === 'CANCELADA');
            if (temCancelada) return 'dia-cancelada';

            const temFinalizada = consultasNoDia.some(c => c.status === 'FINALIZADA');
            if (temFinalizada) return 'dia-finalizada';

            const temAgendada = consultasNoDia.some(c => c.status === 'AGENDADA');
            if (temAgendada) return 'dia-agendada';
        }
        return null;
    };

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Agenda clinica"
                title="Calendario de consultas"
                subtitle="Acompanhe rapidamente o status da agenda e abra os atendimentos do dia."
                actions={
                    <Button variant="dark" className="rounded-pill px-4" onClick={() => navigate('/consultas/hoje')}>
                        Ver agenda de hoje
                    </Button>
                }
            />
            {error && <Alert variant="danger">{error}</Alert>}
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="surface-card">
                        <Card.Body>
                            <Calendar
                                tileClassName={getTileClassName}
                                className="w-100 border-0"
                            />
                        </Card.Body>
                        <Card.Footer>
                            <Row className="align-items-center">
                                <Col xs={12} md={8} className="d-flex align-items-center justify-content-center justify-content-md-start mb-2 mb-md-0">
                                    <div className="d-flex align-items-center me-3"><span style={{height: '1rem', width: '1rem'}} className="bg-success-light rounded-circle me-2"></span>Agendada</div>
                                    <div className="d-flex align-items-center me-3"><span style={{height: '1rem', width: '1rem'}} className="bg-success rounded-circle me-2"></span>Finalizada</div>
                                    <div className="d-flex align-items-center"><span style={{height: '1rem', width: '1rem'}} className="bg-danger-light rounded-circle me-2"></span>Cancelada</div>
                                </Col>
                                <Col xs={12} md={4} className="text-center text-md-end">
                                    <Button variant="dark" onClick={() => navigate('/consultas/hoje')}>
                                        Agendamentos de Hoje
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

// Adicionando as cores do Bootstrap como classes CSS para a legenda
const style = document.createElement('style');
style.innerHTML = `
    .bg-success-light { background-color: #a7f3d0; }
    .bg-danger-light { background-color: #fca5a5; }
`;
document.head.appendChild(style);

export default Consultas;
