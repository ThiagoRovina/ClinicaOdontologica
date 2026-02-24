import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Table, Card } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AgendamentoFront = () => {
    const [pacientes, setPacientes] = useState([]);
    const [dentistas, setDentistas] = useState([]);
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState({ pacientes: true, dentistas: true, consultas: true });
    const [error, setError] = useState(null);

    const [novaConsulta, setNovaConsulta] = useState({
        pacienteId: '',
        dentistaId: '',
        dataHora: ''
    });

    const fetchConsultas = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, consultas: true }));
            const response = await axios.get(`${API_BASE_URL}/consultas`);
            setConsultas(response.data);
        } catch (err) {
            setError("Não foi possível carregar as consultas.");
        } finally {
            setLoading(prev => ({ ...prev, consultas: false }));
        }
    }, []);

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/pacientes`);
                setPacientes(response.data);
            } catch (err) {
                setError("Não foi possível carregar os pacientes.");
            } finally {
                setLoading(prev => ({ ...prev, pacientes: false }));
            }
        };

        const fetchDentistas = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/dentistas`);
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
            await axios.post(`${API_BASE_URL}/consultas`, consultaParaSalvar);
            setNovaConsulta({ pacienteId: '', dentistaId: '', dataHora: '' });
            fetchConsultas();
        } catch (err) {
            setError("Erro ao agendar consulta. Verifique os dados.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/consultas/${id}`);
            fetchConsultas();
        } catch (err) {
            setError("Erro ao cancelar a consulta.");
        }
    };

    return (
        <Container className="mt-5">
            <h2>Agendamento de Consultas</h2>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Nova Consulta</Card.Title>
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
                    <h3>Próximas Consultas</h3>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {loading.consultas ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Dentista</th>
                                    <th>Data e Hora</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {consultas.map(c => (
                                    <tr key={c.idConsulta}>
                                        <td>{c.paciente.nome}</td>
                                        <td>{c.dentista.nome}</td>
                                        <td>{new Date(c.dataHora).toLocaleString('pt-BR')}</td>
                                        <td>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(c.idConsulta)}>Cancelar</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AgendamentoFront;
