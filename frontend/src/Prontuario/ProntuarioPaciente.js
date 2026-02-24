import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:8080/api';

const emptyForm = {
    titulo: '',
    idDentista: '',
    idProcedimento: '',
    dataRealizacao: '',
    observacoes: ''
};

function ProntuarioPaciente() {
    const navigate = useNavigate();
    const { id } = useParams(); // id do paciente

    const [paciente, setPaciente] = useState(null);
    const [prontuarios, setProntuarios] = useState([]);
    const [dentistas, setDentistas] = useState([]);
    const [procedimentos, setProcedimentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const canSubmit = useMemo(() => !!form.titulo && !!form.dataRealizacao, [form.titulo, form.dataRealizacao]);

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            const [pacienteRes, prontRes, dentRes, procRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/pacientes/${id}`),
                axios.get(`${API_BASE_URL}/prontuarios/paciente/${id}`),
                axios.get(`${API_BASE_URL}/dentistas`),
                axios.get(`${API_BASE_URL}/procedimentos`),
            ]);

            setPaciente(pacienteRes.data);
            setProntuarios(prontRes.data);
            setDentistas(dentRes.data);
            setProcedimentos(procRes.data);
            setError(null);
        } catch (_) {
            setError('Nao foi possivel carregar o prontuario.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!canSubmit) {
            setError('Preencha titulo e data.');
            return;
        }

        setSaving(true);
        try {
            await axios.post(`${API_BASE_URL}/prontuarios`, {
                titulo: form.titulo,
                idPaciente: id,
                idDentista: form.idDentista || null,
                idProcedimento: form.idProcedimento || null,
                dataRealizacao: form.dataRealizacao,
                observacoes: form.observacoes
            });
            setForm(emptyForm);
            setSuccess('Registro adicionado ao prontuario.');
            await fetchAll();
        } catch (err) {
            const msg = err.response?.data || 'Erro ao salvar prontuario.';
            setError(typeof msg === 'string' ? msg : 'Erro ao salvar prontuario.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (idProntuario) => {
        setError(null);
        setSuccess(null);
        try {
            await axios.delete(`${API_BASE_URL}/prontuarios/${idProntuario}`);
            await fetchAll();
        } catch (_) {
            setError('Nao foi possivel excluir o registro do prontuario.');
        }
    };

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 className="mb-1">Prontuario do Paciente</h2>
                    {paciente && <div className="text-muted">{paciente.nome} ({paciente.cpf})</div>}
                </div>
                <Button variant="secondary" onClick={() => navigate('/pacientes')}>Voltar</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {loading ? (
                <div className="text-center my-5"><Spinner animation="border" /></div>
            ) : (
                <Row className="g-4">
                    <Col lg={5}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Novo Registro</Card.Title>
                                <Form className="mt-3" onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Titulo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="titulo"
                                            value={form.titulo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Dentista (opcional)</Form.Label>
                                        <Form.Select name="idDentista" value={form.idDentista} onChange={handleChange}>
                                            <option value="">Selecione</option>
                                            {dentistas.map(d => (
                                                <option key={d.idDentista} value={d.idDentista}>{d.nome}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Procedimento (opcional)</Form.Label>
                                        <Form.Select name="idProcedimento" value={form.idProcedimento} onChange={handleChange}>
                                            <option value="">Selecione</option>
                                            {procedimentos.map(p => (
                                                <option key={p.idProcedimento} value={p.idProcedimento}>{p.nome}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="dataRealizacao"
                                            value={form.dataRealizacao}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Observacoes</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="observacoes"
                                            value={form.observacoes}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                    <Button type="submit" variant="primary" disabled={saving}>
                                        {saving ? 'Salvando...' : 'Adicionar'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={7}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title>Historico</Card.Title>
                                <Table striped bordered hover responsive className="mt-3 mb-0">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Titulo</th>
                                            <th>Dentista</th>
                                            <th>Procedimento</th>
                                            <th style={{ width: 120 }}>Acoes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prontuarios.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center text-muted">Nenhum registro no prontuario.</td>
                                            </tr>
                                        ) : prontuarios.map(p => (
                                            <tr key={p.idProntuario}>
                                                <td>{p.dataRealizacao}</td>
                                                <td>{p.titulo}</td>
                                                <td>{p.dentista?.nome || '-'}</td>
                                                <td>{p.procedimento?.nome || '-'}</td>
                                                <td>
                                                    <Button size="sm" variant="danger" onClick={() => handleDelete(p.idProntuario)}>Excluir</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
}

export default ProntuarioPaciente;
