import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Table, Card, Badge } from 'react-bootstrap';
import api from '../api';
import PageHeader from '../components/PageHeader';

const AgendamentoFront = () => {
    const [pacientes, setPacientes] = useState([]);
    const [dentistas, setDentistas] = useState([]);
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState({ pacientes: true, dentistas: true, consultas: true });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [filtroDentista, setFiltroDentista] = useState('');
    const [filtroData, setFiltroData] = useState(new Date().toISOString().slice(0, 10));

    const [novaConsulta, setNovaConsulta] = useState({
        pacienteId: '',
        dentistaId: '',
        dataHora: ''
    });

    const fetchConsultas = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, consultas: true }));
            const params = { data: filtroData };
            if (filtroDentista) {
                params.dentistaId = filtroDentista;
            }
            const response = await api.get('/api/consultas', { params });
            setConsultas(response.data);
        } catch (err) {
            setError("Não foi possível carregar as consultas.");
        } finally {
            setLoading(prev => ({ ...prev, consultas: false }));
        }
    }, [filtroData, filtroDentista]);

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await api.get('/api/pacientes');
                setPacientes(response.data);
            } catch (err) {
                setError("Não foi possível carregar os pacientes.");
            } finally {
                setLoading(prev => ({ ...prev, pacientes: false }));
            }
        };

        const fetchDentistas = async () => {
            try {
                const response = await api.get('/api/dentistas');
                setDentistas(response.data);
            } catch (err) {
                setError("Não foi possível carregar os dentistas.");
            } finally {
                setLoading(prev => ({ ...prev, dentistas: false }));
            }
        };

        fetchPacientes();
        fetchDentistas();
        fetchConsultas();
    }, [fetchConsultas]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovaConsulta(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const consultaParaSalvar = {
            paciente: { idPaciente: novaConsulta.pacienteId },
            dentista: { idDentista: novaConsulta.dentistaId },
            dataHora: novaConsulta.dataHora
        };

        try {
            await api.post('/api/consultas', consultaParaSalvar);
            setNovaConsulta({ pacienteId: '', dentistaId: '', dataHora: '' });
            setSuccess('Consulta agendada com sucesso.');
            fetchConsultas();
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao agendar consulta. Verifique os dados.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/consultas/${id}`);
            setSuccess('Consulta cancelada com sucesso.');
            fetchConsultas();
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao cancelar a consulta.");
        }
    };

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Agenda inteligente"
                title="Agendamento de consultas"
                subtitle="Filtre por dentista e data, visualize a agenda diaria e evite conflitos de horario automaticamente."
            />
            <Row>
                <Col md={4}>
                    <Card className="surface-card">
                        <Card.Body>
                            <Card.Title>Nova Consulta</Card.Title>
                            {success && <Alert variant="success">{success}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Paciente</Form.Label>
                                    <Form.Select name="pacienteId" value={novaConsulta.pacienteId} onChange={handleChange} required>
                                        <option value="">Selecione o Paciente</option>
                                        {pacientes.map(p => <option key={p.idPaciente} value={p.idPaciente}>{p.nome}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dentista</Form.Label>
                                    <Form.Select name="dentistaId" value={novaConsulta.dentistaId} onChange={handleChange} required>
                                        <option value="">Selecione o Dentista</option>
                                        {dentistas.map(d => <option key={d.idDentista} value={d.idDentista}>{d.nome} - {d.especializacao}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data e Hora</Form.Label>
                                    <Form.Control type="datetime-local" name="dataHora" value={novaConsulta.dataHora} onChange={handleChange} required />
                                </Form.Group>
                                <Button variant="primary" type="submit">Agendar</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="surface-card">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                                <div>
                                    <h3 className="mb-1">Agenda do dia</h3>
                                    <span className="section-subtitle">Filtre por dentista para visualizar disponibilidade e atendimentos.</span>
                                </div>
                                <Badge bg="light" text="dark">{consultas.length} consultas</Badge>
                            </div>
                            <Row className="g-3 mb-3">
                                <Col md={6}>
                                    <Form.Label>Data</Form.Label>
                                    <Form.Control type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Dentista</Form.Label>
                                    <Form.Select value={filtroDentista} onChange={(e) => setFiltroDentista(e.target.value)}>
                                        <option value="">Todos os dentistas</option>
                                        {dentistas.map((d) => <option key={d.idDentista} value={d.idDentista}>{d.nome}</option>)}
                                    </Form.Select>
                                </Col>
                            </Row>
                    {loading.consultas ? (
                        <div className="loading-shell"><Spinner animation="border" /></div>
                    ) : (
                        <div className="table-shell">
                        <Table hover responsive className="align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Dentista</th>
                                    <th>Data e Hora</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consultas.map(c => (
                                    <tr key={c.idConsulta}>
                                        <td>{c.paciente.nome}</td>
                                        <td>{c.dentista.nome}</td>
                                        <td>{new Date(c.dataHora).toLocaleString('pt-BR')}</td>
                                        <td><Badge bg={c.status === 'AGENDADA' ? 'primary' : c.status === 'FINALIZADA' ? 'success' : 'danger'}>{c.status}</Badge></td>
                                        <td>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(c.idConsulta)}>Cancelar</Button>
                                        </td>
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
        </Container>
    );
};

export default AgendamentoFront;
