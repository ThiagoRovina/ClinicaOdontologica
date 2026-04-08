import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Col, Row, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, tratarErroBackend } from '../ultilitarios/ultilitarios';

const ConsultasHoje = () => {
    const navigate = useNavigate();
    const [consultasHoje, setConsultasHoje] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/consultas/hoje`)
            .then(response => { setConsultasHoje(response.data); setLoading(false); })
            .catch(() => { setError('Nao foi possivel carregar as consultas de hoje.'); setLoading(false); });
    }, []);

    useEffect(() => { if (success) { const t = setTimeout(() => setSuccess(null), 5000); return () => clearTimeout(t); } }, [success]);
    useEffect(() => { if (error) { const t = setTimeout(() => setError(null), 8000); return () => clearTimeout(t); } }, [error]);

    const iniciarAcao = (id, tipo) => { setConfirmAction({ id, tipo, loading: false }); };

    const confirmarAcao = async () => {
        if (!confirmAction) return;
        setConfirmAction(prev => ({ ...prev, loading: true }));
        try {
            if (confirmAction.tipo === 'finalizar') {
                await axios.patch(`${API_BASE_URL}/consultas/${confirmAction.id}/finalizar`);
                setSuccess('Consulta finalizada com sucesso.');
            } else {
                await axios.patch(`${API_BASE_URL}/consultas/${confirmAction.id}/cancelar`);
                setSuccess('Consulta cancelada com sucesso.');
            }
            setConsultasHoje(prev => prev.filter(c => c.idConsulta !== confirmAction.id));
        } catch (err) {
            setError(tratarErroBackend(err, `Erro ao ${confirmAction.tipo === 'finalizar' ? 'finalizar' : 'cancelar'} consulta.`));
        } finally { setConfirmAction(null); }
    };

    if (loading) {
        return <div className="loading-shell"><Spinner animation="border" /></div>;
    }

    return (
        <Container className="page-shell">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Hoje</span>
                    <h1 className="section-title">Agendamentos do Dia</h1>
                    <p className="section-subtitle">Acompanhe e gerencie as consultas agendadas para hoje.</p>
                </div>
                <Button variant="outline-secondary" className="rounded-pill" onClick={() => navigate('/consultas')}>Calendario</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {consultasHoje.length === 0 ? (
                <Alert variant="info">Nenhum agendamento para hoje.</Alert>
            ) : (
                <Row className="g-4">
                    {consultasHoje.map(c => (
                        <Col md={6} key={c.idConsulta}>
                            <Card className="surface-card" style={{
                                borderLeft: `4px solid ${c.status === 'AGENDADA' ? '#3b82f6' : '#10b981'}`
                            }}>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h5 className="mb-1 fw-semibold">{c.paciente.nome}</h5>
                                            <small className="text-muted">{c.dentista.nome}</small>
                                        </div>
                                        <Badge bg={c.status === 'AGENDADA' ? 'primary' : 'success'} pill>{c.status}</Badge>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-muted">
                                            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                                        </svg>
                                        <span className="fw-medium">
                                            {new Date(c.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {c.status === 'AGENDADA' && (
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-success" size="sm" className="rounded-pill flex-fill" onClick={() => iniciarAcao(c.idConsulta, 'finalizar')}>
                                                Finalizar
                                            </Button>
                                            <Button variant="outline-danger" size="sm" className="rounded-pill flex-fill" onClick={() => iniciarAcao(c.idConsulta, 'cancelar')}>
                                                Cancelar
                                            </Button>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <ConfirmarExclusao
                show={!!confirmAction}
                titulo={confirmAction?.tipo === 'finalizar' ? 'Finalizar Consulta' : 'Cancelar Consulta'}
                mensagem={confirmAction?.tipo === 'finalizar' ? 'Deseja finalizar esta consulta como concluida?' : 'Tem certeza que deseja cancelar esta consulta?'}
                onConfirm={confirmarAcao}
                onCancel={() => setConfirmAction(null)}
                loading={confirmAction?.loading || false}
            />
        </Container>
    );
};

export default ConsultasHoje;