import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import './ConsultasStyles.css';
import { API_BASE_URL } from '../config/api';
import PageHeader from '../components/PageHeader';

const Consultas = () => {
    const navigate = useNavigate();
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        axios.get(`${API_BASE_URL}/consultas`)
            .then(response => { setConsultas(response.data); setLoading(false); })
            .catch(() => setLoading(false));
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

    const consultasDoDia = selectedDate
        ? consultas.filter(c => c.dataHora.startsWith(selectedDate.toISOString().split('T')[0]))
        : [];

    if (loading) {
        return <div className="loading-shell"><Spinner animation="border" /></div>;
    }

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Calendario"
                title="Consultas"
                subtitle="Navegue pelo calendario para visualizar os agendamentos de cada dia."
            />

            <Row className="g-4">
                <Col lg={7}>
                    <Card className="surface-card">
                        <Card.Body>
                            <Calendar
                                tileClassName={getTileClassName}
                                className="w-100 border-0"
                                value={selectedDate}
                                onChange={setSelectedDate}
                            />
                        </Card.Body>
                        <Card.Footer className="bg-transparent border-0 d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex gap-3">
                                <div className="d-flex align-items-center"><span className="legend-dot legend-dot--agendada"></span>Agendada</div>
                                <div className="d-flex align-items-center"><span className="legend-dot legend-dot--finalizada"></span>Finalizada</div>
                                <div className="d-flex align-items-center"><span className="legend-dot legend-dot--cancelada"></span>Cancelada</div>
                            </div>
                            <Button variant="dark" className="rounded-pill px-4" onClick={() => navigate('/consultas/hoje')}>
                                Agendamentos de Hoje
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="surface-card h-100">
                        <Card.Body>
                            <Card.Title className="fw-semibold mb-3">
                                Consultas em {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </Card.Title>
                            {consultasDoDia.length > 0 ? (
                                <div className="d-flex flex-column gap-3">
                                    {consultasDoDia.map(c => (
                                        <div key={c.idConsulta} style={{
                                            border: '1px solid rgba(22,50,79,0.08)',
                                            borderRadius: 14,
                                            padding: '0.85rem 1rem',
                                            background: '#fff',
                                            borderLeft: `3px solid ${c.status === 'AGENDADA' ? '#3b82f6' : c.status === 'FINALIZADA' ? '#10b981' : '#ef4444'}`
                                        }}>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="fw-semibold">{c.paciente.nome}</span>
                                                <span className="status-badge" style={{
                                                    background: c.status === 'AGENDADA' ? '#dbeafe' : c.status === 'FINALIZADA' ? '#d1fae5' : '#fee2e2',
                                                    color: c.status === 'AGENDADA' ? '#1e40af' : c.status === 'FINALIZADA' ? '#065f46' : '#991b1b'
                                                }}>
                                                    {c.status}
                                                </span>
                                            </div>
                                            <div className="small text-muted">
                                                {new Date(c.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} — {c.dentista.nome}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <p className="mb-0">Nenhuma consulta nesta data.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Consultas;