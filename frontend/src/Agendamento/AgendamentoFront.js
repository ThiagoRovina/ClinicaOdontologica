import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, tratarErroBackend } from '../ultilitarios/ultilitarios';
import PageHeader from '../components/PageHeader';

const IconCalendar = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
);
const IconClock = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
);
const IconUser = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/>
    </svg>
);

function StatusBadge({ status }) {
    const labels = {
        'AGENDADA': 'Agendada',
        'FINALIZADA': 'Finalizada',
        'CANCELADA': 'Cancelada'
    };
    return (
        <span className={`status-badge`} style={{
            background: status === 'AGENDADA' ? '#dbeafe' : status === 'FINALIZADA' ? '#d1fae5' : '#fee2e2',
            color: status === 'AGENDADA' ? '#1e40af' : status === 'FINALIZADA' ? '#065f46' : '#991b1b'
        }}>
            {labels[status] || status}
        </span>
    );
}

const AgendamentoFront = () => {
    const [pacientes, setPacientes] = useState([]);
    const [dentistas, setDentistas] = useState([]);
    const [consultas, setConsultas] = useState([]);
    const [listaEspera, setListaEspera] = useState([]);
    const [loading, setLoading] = useState({ pacientes: true, dentistas: true, consultas: true, listaEspera: true });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [agendando, setAgendando] = useState(false);
    const [novaConsulta, setNovaConsulta] = useState({ pacienteId: '', dentistaId: '', dataHora: '' });
    const [novaEntradaLista, setNovaEntradaLista] = useState({ pacienteId: '', dentistaId: '', dataPreferida: '', horarioInicioPreferido: '', horarioFimPreferido: '', observacoes: '' });
    const [excluirConsultaId, setExcluirConsultaId] = useState(null);
    const [excluindoConsulta, setExcluindoConsulta] = useState(false);

    const fetchConsultas = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, consultas: true }));
            const response = await axios.get(`${API_BASE_URL}/consultas`);
            setConsultas(response.data);
            setError(null);
        } catch {
            setError('Nao foi possivel carregar as consultas.');
        } finally {
            setLoading(prev => ({ ...prev, consultas: false }));
        }
    }, []);

    const fetchListaEspera = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, listaEspera: true }));
            const response = await axios.get(`${API_BASE_URL}/lista-espera/ativas`);
            setListaEspera(response.data);
            setError(null);
        } catch {
            setError('Nao foi possivel carregar a lista de espera.');
        } finally {
            setLoading(prev => ({ ...prev, listaEspera: false }));
        }
    }, []);

    useEffect(() => {
        const fetch = async (setter, loader, label) => {
            try {
                const response = await axios.get(`${API_BASE_URL}/${label}`);
                setter(response.data);
            } catch {
                setError(`Nao foi possivel carregar os ${label}.`);
            } finally {
                setLoading(prev => ({ ...prev, [loader]: false }));
            }
        };
        fetch(setPacientes, 'pacientes', 'pacientes');
        fetch(setDentistas, 'dentistas', 'dentistas');
        fetchConsultas();
        fetchListaEspera();
    }, [fetchConsultas, fetchListaEspera]);

    useEffect(() => {
        if (success) { const t = setTimeout(() => setSuccess(null), 5000); return () => clearTimeout(t); }
    }, [success]);
    useEffect(() => {
        if (error) { const t = setTimeout(() => setError(null), 8000); return () => clearTimeout(t); }
    }, [error]);

    const handleConsultaChange = (e) => { setNovaConsulta(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleListaChange = (e) => { setNovaEntradaLista(prev => ({ ...prev, [e.target.name]: e.target.value })); };

    const handleSubmitConsulta = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setAgendando(true);
        try {
            await axios.post(`${API_BASE_URL}/consultas`, {
                paciente: { idPaciente: novaConsulta.pacienteId },
                dentista: { idDentista: novaConsulta.dentistaId },
                dataHora: novaConsulta.dataHora
            });
            setNovaConsulta({ pacienteId: '', dentistaId: '', dataHora: '' });
            setSuccess('Consulta agendada com sucesso!');
            fetchConsultas();
        } catch (err) {
            setError(tratarErroBackend(err, 'Erro ao agendar consulta. Verifique os dados.'));
        } finally {
            setAgendando(false);
        }
    };

    const handleSubmitListaEspera = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await axios.post(`${API_BASE_URL}/lista-espera`, {
                paciente: { idPaciente: novaEntradaLista.pacienteId },
                dentista: { idDentista: novaEntradaLista.dentistaId },
                dataPreferida: novaEntradaLista.dataPreferida,
                horarioInicioPreferido: novaEntradaLista.horarioInicioPreferido || null,
                horarioFimPreferido: novaEntradaLista.horarioFimPreferido || null,
                observacoes: novaEntradaLista.observacoes || null
            });
            setNovaEntradaLista({ pacienteId: '', dentistaId: '', dataPreferida: '', horarioInicioPreferido: '', horarioFimPreferido: '', observacoes: '' });
            setSuccess('Paciente adicionado a lista de espera.');
            fetchListaEspera();
        } catch (err) {
            setError(tratarErroBackend(err, 'Erro ao incluir na lista de espera.'));
        }
    };

    const confirmarExclusaoConsulta = async () => {
        if (!excluirConsultaId) return;
        setExcluindoConsulta(true);
        try {
            await axios.delete(`${API_BASE_URL}/consultas/${excluirConsultaId}`);
            setSuccess('Consulta cancelada.');
            fetchConsultas();
            fetchListaEspera();
        } catch (err) {
            setError(tratarErroBackend(err, 'Erro ao cancelar a consulta.'));
        } finally {
            setExcluindoConsulta(false);
            setExcluirConsultaId(null);
        }
    };

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Agenda"
                title="Consultas e Lista de Espera"
                subtitle="Agende novos atendimentos ou acompanhe os agendamentos e a fila de espera."
            />

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Row className="g-4">
                {/* Forms */}
                <Col lg={4}>
                    <Card className="surface-card mb-4">
                        <Card.Body>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: 'linear-gradient(135deg, #0f766e, #0c4a6e)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                }}>
                                    <IconCalendar />
                                </div>
                                <Card.Title className="mb-0 fw-semibold">Nova Consulta</Card.Title>
                            </div>
                            <Form onSubmit={handleSubmitConsulta} className="mt-3">
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium"><IconUser /> Paciente</Form.Label>
                                    <Form.Select name="pacienteId" value={novaConsulta.pacienteId} onChange={handleConsultaChange} required className="toolbar-input">
                                        <option value="">Selecione o Paciente</option>
                                        {pacientes.map(p => <option key={p.idPaciente} value={p.idPaciente}>{p.nome}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium">Dentista</Form.Label>
                                    <Form.Select name="dentistaId" value={novaConsulta.dentistaId} onChange={handleConsultaChange} required className="toolbar-input">
                                        <option value="">Selecione o Dentista</option>
                                        {dentistas.map(d => <option key={d.idDentista} value={d.idDentista}>{d.nome} - {d.especializacao}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium"><IconClock /> Data e Hora</Form.Label>
                                    <Form.Control type="datetime-local" name="dataHora" value={novaConsulta.dataHora} onChange={handleConsultaChange} required className="toolbar-input" />
                                </Form.Group>
                                <Button variant="dark" type="submit" disabled={agendando} className="w-100 rounded-pill">
                                    {agendando ? <><Spinner as="span" animation="border" size="sm" className="me-2" /> Agendando...</> : 'Agendar Consulta'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="surface-card">
                        <Card.Body>
                            <Card.Title className="mb-3 fw-semibold">Lista de Espera</Card.Title>
                            <Form onSubmit={handleSubmitListaEspera} className="mt-2">
                                <Form.Group className="mb-3">
                                    <Form.Label>Paciente</Form.Label>
                                    <Form.Select name="pacienteId" value={novaEntradaLista.pacienteId} onChange={handleListaChange} required className="toolbar-input">
                                        <option value="">Selecione</option>
                                        {pacientes.map(p => <option key={p.idPaciente} value={p.idPaciente}>{p.nome}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dentista</Form.Label>
                                    <Form.Select name="dentistaId" value={novaEntradaLista.dentistaId} onChange={handleListaChange} required className="toolbar-input">
                                        <option value="">Selecione</option>
                                        {dentistas.map(d => <option key={d.idDentista} value={d.idDentista}>{d.nome}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data Preferida</Form.Label>
                                    <Form.Control type="date" name="dataPreferida" value={novaEntradaLista.dataPreferida} onChange={handleListaChange} required className="toolbar-input" />
                                </Form.Group>
                                <Row className="g-2 mb-3">
                                    <Col>
                                        <Form.Label className="small text-muted">Inicio</Form.Label>
                                        <Form.Control type="time" name="horarioInicioPreferido" value={novaEntradaLista.horarioInicioPreferido} onChange={handleListaChange} className="toolbar-input" />
                                    </Col>
                                    <Col>
                                        <Form.Label className="small text-muted">Fim</Form.Label>
                                        <Form.Control type="time" name="horarioFimPreferido" value={novaEntradaLista.horarioFimPreferido} onChange={handleListaChange} className="toolbar-input" />
                                    </Col>
                                </Row>
                                <Button variant="outline-dark" type="submit" className="w-100 rounded-pill">
                                    Entrar na Lista de Espera
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Tables */}
                <Col lg={8}>
                    <Card className="surface-card mb-4">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0 fw-semibold">Consultas Agendadas</h5>
                                <span className="badge bg-primary rounded-pill">{consultas.filter(c => c.status === 'AGENDADA').length} ativas</span>
                            </div>
                            {loading.consultas ? (
                                <div className="text-center py-4"><Spinner animation="border" /><p className="text-muted small mt-2">Carregando consultas...</p></div>
                            ) : consultas.length === 0 ? (
                                <Alert variant="info">Nenhuma consulta agendada.</Alert>
                            ) : (
                                <div className="table-shell">
                                    <Table hover responsive className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>Paciente</th>
                                                <th>Dentista</th>
                                                <th>Data</th>
                                                <th>Status</th>
                                                <th style={{ width: 100 }}>Acoes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {consultas.map(c => (
                                                <tr key={c.idConsulta}>
                                                    <td className="fw-medium">{c.paciente.nome}</td>
                                                    <td>{c.dentista.nome}</td>
                                                    <td className="small text-muted">{new Date(c.dataHora).toLocaleString('pt-BR')}</td>
                                                    <td><StatusBadge status={c.status} /></td>
                                                    <td>
                                                        {c.status === 'AGENDADA' && (
                                                            <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => setExcluirConsultaId(c.idConsulta)}>
                                                                Cancelar
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="surface-card">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0 fw-semibold">Lista de Espera</h5>
                                <span className="badge bg-warning text-dark rounded-pill">{listaEspera.length} aguardando</span>
                            </div>
                            {loading.listaEspera ? (
                                <div className="text-center py-4"><Spinner animation="border" /></div>
                            ) : listaEspera.length === 0 ? (
                                <Alert variant="info">Nenhum paciente aguardando no momento.</Alert>
                            ) : (
                                <div className="table-shell">
                                    <Table hover responsive className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>Paciente</th>
                                                <th>Dentista</th>
                                                <th>Data</th>
                                                <th>Janela</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listaEspera.map(item => (
                                                <tr key={item.idListaEspera}>
                                                    <td className="fw-medium">{item.paciente.nome}</td>
                                                    <td>{item.dentista.nome}</td>
                                                    <td>{new Date(`${item.dataPreferida}T00:00:00`).toLocaleDateString('pt-BR')}</td>
                                                    <td className="small">{item.horarioInicioPreferido || '--:--'} ate {item.horarioFimPreferido || '--:--'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <ConfirmarExclusao
                show={!!excluirConsultaId}
                titulo="Cancelar Consulta"
                mensagem="Tem certeza que deseja cancelar esta consulta? Esta acao nao pode ser desfeita."
                onConfirm={confirmarExclusaoConsulta}
                onCancel={() => setExcluirConsultaId(null)}
                loading={excluindoConsulta}
            />
        </Container>
    );
};

export default AgendamentoFront;
