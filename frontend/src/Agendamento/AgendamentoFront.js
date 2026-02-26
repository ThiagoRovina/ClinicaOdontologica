import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Table, Card } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AgendamentoFront = () => {
    const [pacientes, setPacientes] = useState([]);
    const [dentistas, setDentistas] = useState([]);
    const [consultas, setConsultas] = useState([]);
    const [listaEspera, setListaEspera] = useState([]);
    const [loading, setLoading] = useState({
        pacientes: true,
        dentistas: true,
        consultas: true,
        listaEspera: true
    });
    const [error, setError] = useState(null);

    const [novaConsulta, setNovaConsulta] = useState({
        pacienteId: '',
        dentistaId: '',
        dataHora: ''
    });

    const [novaEntradaLista, setNovaEntradaLista] = useState({
        pacienteId: '',
        dentistaId: '',
        dataPreferida: '',
        horarioInicioPreferido: '',
        horarioFimPreferido: '',
        observacoes: ''
    });

    const fetchConsultas = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, consultas: true }));
            const response = await axios.get(`${API_BASE_URL}/consultas`);
            setConsultas(response.data);
        } catch (err) {
            setError('Não foi possível carregar as consultas.');
        } finally {
            setLoading(prev => ({ ...prev, consultas: false }));
        }
    }, []);

    const fetchListaEspera = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, listaEspera: true }));
            const response = await axios.get(`${API_BASE_URL}/lista-espera/ativas`);
            setListaEspera(response.data);
        } catch (err) {
            setError('Não foi possível carregar a lista de espera.');
        } finally {
            setLoading(prev => ({ ...prev, listaEspera: false }));
        }
    }, []);

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/pacientes`);
                setPacientes(response.data);
            } catch (err) {
                setError('Não foi possível carregar os pacientes.');
            } finally {
                setLoading(prev => ({ ...prev, pacientes: false }));
            }
        };

        const fetchDentistas = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/dentistas`);
                setDentistas(response.data);
            } catch (err) {
                setError('Não foi possível carregar os dentistas.');
            } finally {
                setLoading(prev => ({ ...prev, dentistas: false }));
            }
        };

        fetchPacientes();
        fetchDentistas();
        fetchConsultas();
        fetchListaEspera();
    }, [fetchConsultas, fetchListaEspera]);

    const handleConsultaChange = (e) => {
        const { name, value } = e.target;
        setNovaConsulta(prev => ({ ...prev, [name]: value }));
    };

    const handleListaChange = (e) => {
        const { name, value } = e.target;
        setNovaEntradaLista(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitConsulta = async (e) => {
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
            setError('Erro ao agendar consulta. Verifique os dados.');
        }
    };

    const handleSubmitListaEspera = async (e) => {
        e.preventDefault();
        setError(null);

        const listaParaSalvar = {
            paciente: { idPaciente: novaEntradaLista.pacienteId },
            dentista: { idDentista: novaEntradaLista.dentistaId },
            dataPreferida: novaEntradaLista.dataPreferida,
            horarioInicioPreferido: novaEntradaLista.horarioInicioPreferido || null,
            horarioFimPreferido: novaEntradaLista.horarioFimPreferido || null,
            observacoes: novaEntradaLista.observacoes || null
        };

        try {
            await axios.post(`${API_BASE_URL}/lista-espera`, listaParaSalvar);
            setNovaEntradaLista({
                pacienteId: '',
                dentistaId: '',
                dataPreferida: '',
                horarioInicioPreferido: '',
                horarioFimPreferido: '',
                observacoes: ''
            });
            fetchListaEspera();
        } catch (err) {
            setError('Erro ao incluir paciente na lista de espera.');
        }
    };

    const handleCancelarConsulta = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/consultas/${id}`);
            fetchConsultas();
            fetchListaEspera();
        } catch (err) {
            setError('Erro ao cancelar a consulta.');
        }
    };

    const handleCancelarListaEspera = async (id) => {
        try {
            await axios.patch(`${API_BASE_URL}/lista-espera/${id}/cancelar`);
            fetchListaEspera();
        } catch (err) {
            setError('Erro ao remover paciente da lista de espera.');
        }
    };

    return (
        <Container className="mt-5">
            <h2>Agendamento de Consultas</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Nova Consulta</Card.Title>
                            <Form onSubmit={handleSubmitConsulta}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Paciente</Form.Label>
                                    <Form.Select name="pacienteId" value={novaConsulta.pacienteId} onChange={handleConsultaChange} required>
                                        <option value="">Selecione o Paciente</option>
                                        {pacientes.map(p => <option key={p.idPaciente} value={p.idPaciente}>{p.nome}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dentista</Form.Label>
                                    <Form.Select name="dentistaId" value={novaConsulta.dentistaId} onChange={handleConsultaChange} required>
                                        <option value="">Selecione o Dentista</option>
                                        {dentistas.map(d => <option key={d.idDentista} value={d.idDentista}>{d.nome} - {d.especializacao}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data e Hora</Form.Label>
                                    <Form.Control type="datetime-local" name="dataHora" value={novaConsulta.dataHora} onChange={handleConsultaChange} required />
                                </Form.Group>
                                <Button variant="primary" type="submit">Agendar</Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <Card.Title>Adicionar à Lista de Espera</Card.Title>
                            <Form onSubmit={handleSubmitListaEspera}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Paciente</Form.Label>
                                    <Form.Select name="pacienteId" value={novaEntradaLista.pacienteId} onChange={handleListaChange} required>
                                        <option value="">Selecione o Paciente</option>
                                        {pacientes.map(p => <option key={p.idPaciente} value={p.idPaciente}>{p.nome}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dentista</Form.Label>
                                    <Form.Select name="dentistaId" value={novaEntradaLista.dentistaId} onChange={handleListaChange} required>
                                        <option value="">Selecione o Dentista</option>
                                        {dentistas.map(d => <option key={d.idDentista} value={d.idDentista}>{d.nome} - {d.especializacao}</option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data Preferida</Form.Label>
                                    <Form.Control type="date" name="dataPreferida" value={novaEntradaLista.dataPreferida} onChange={handleListaChange} required />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Início Preferido</Form.Label>
                                            <Form.Control type="time" name="horarioInicioPreferido" value={novaEntradaLista.horarioInicioPreferido} onChange={handleListaChange} />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Fim Preferido</Form.Label>
                                            <Form.Control type="time" name="horarioFimPreferido" value={novaEntradaLista.horarioFimPreferido} onChange={handleListaChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Observações</Form.Label>
                                    <Form.Control as="textarea" rows={2} name="observacoes" value={novaEntradaLista.observacoes} onChange={handleListaChange} />
                                </Form.Group>
                                <Button variant="outline-primary" type="submit">Entrar na Lista</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <h3>Consultas</h3>
                    {loading.consultas ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : (
                        <Table striped bordered hover>
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
                                        <td>{c.status}</td>
                                        <td>
                                            {c.status === 'AGENDADA' && (
                                                <Button variant="danger" size="sm" onClick={() => handleCancelarConsulta(c.idConsulta)}>
                                                    Cancelar
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}

                    <h3 className="mt-5">Lista de Espera Ativa</h3>
                    {loading.listaEspera ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>Dentista</th>
                                    <th>Data</th>
                                    <th>Janela de Horário</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaEspera.length > 0 ? listaEspera.map(item => (
                                    <tr key={item.idListaEspera}>
                                        <td>{item.paciente.nome}</td>
                                        <td>{item.dentista.nome}</td>
                                        <td>{new Date(`${item.dataPreferida}T00:00:00`).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            {item.horarioInicioPreferido || '--:--'} até {item.horarioFimPreferido || '--:--'}
                                        </td>
                                        <td>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleCancelarListaEspera(item.idListaEspera)}>
                                                Remover
                                            </Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Nenhum paciente aguardando no momento.</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AgendamentoFront;
