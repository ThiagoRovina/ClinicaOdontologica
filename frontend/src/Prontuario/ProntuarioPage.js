import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../api';
import PageHeader from '../components/PageHeader';

function ProntuarioPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [paciente, setPaciente] = useState(null);
    const [procedimentos, setProcedimentos] = useState([]);
    const [prontuarios, setProntuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState({
        procedimentoId: '',
        dataRealizacao: new Date().toISOString().slice(0, 10),
        observacoes: ''
    });

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [pacienteResponse, procedimentosResponse, prontuariosResponse] = await Promise.all([
                api.get(`/api/pacientes/${id}`),
                api.get('/api/procedimentos'),
                api.get(`/api/prontuarios/paciente/${id}`)
            ]);

            setPaciente(pacienteResponse.data);
            setProcedimentos(procedimentosResponse.data);
            setProntuarios(prontuariosResponse.data);
            setError(null);
        } catch (err) {
            setError('Nao foi possivel carregar o prontuario deste paciente.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await api.post('/api/prontuarios', {
                pacienteId: Number(id),
                procedimentoId: Number(form.procedimentoId),
                dataRealizacao: form.dataRealizacao,
                observacoes: form.observacoes
            });
            setSuccess('Registro incluido no prontuario com sucesso.');
            setForm({
                procedimentoId: '',
                dataRealizacao: new Date().toISOString().slice(0, 10),
                observacoes: ''
            });
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Nao foi possivel salvar este registro no prontuario.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Prontuario"
                title={paciente ? `Historico de ${paciente.nome}` : 'Prontuario do paciente'}
                subtitle="Registre procedimentos realizados, observacoes clinicas e acompanhe o historico odontologico."
                actions={<Button variant="outline-dark" onClick={() => navigate('/pacientes')}>Voltar aos pacientes</Button>}
            />

            {loading ? (
                <div className="loading-shell"><Spinner animation="border" /></div>
            ) : (
                <Row className="g-4">
                    <Col lg={4}>
                        <Card className="surface-card">
                            <Card.Body>
                                <h4 className="mb-3">Novo registro</h4>
                                {error && <Alert variant="danger">{error}</Alert>}
                                {success && <Alert variant="success">{success}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Procedimento</Form.Label>
                                        <Form.Select name="procedimentoId" value={form.procedimentoId} onChange={handleChange} required>
                                            <option value="">Selecione um procedimento</option>
                                            {procedimentos.map((procedimento) => (
                                                <option key={procedimento.idProcedimento} value={procedimento.idProcedimento}>
                                                    {procedimento.nome} - R$ {Number(procedimento.valor).toFixed(2)}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Data de realizacao</Form.Label>
                                        <Form.Control type="date" name="dataRealizacao" value={form.dataRealizacao} onChange={handleChange} required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Observacoes</Form.Label>
                                        <Form.Control as="textarea" rows={5} name="observacoes" value={form.observacoes} onChange={handleChange} />
                                    </Form.Group>
                                    <Button variant="dark" type="submit" disabled={saving}>
                                        {saving ? 'Salvando...' : 'Salvar no prontuario'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={8}>
                        <Card className="surface-card">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="mb-1">Historico odontologico</h4>
                                        <span className="section-subtitle">Paciente: {paciente?.nome}</span>
                                    </div>
                                    <Badge bg="light" text="dark">{prontuarios.length} registros</Badge>
                                </div>
                                {prontuarios.length === 0 ? (
                                    <Alert variant="info" className="mb-0">Nenhum procedimento registrado ainda para este paciente.</Alert>
                                ) : (
                                    <div className="table-shell">
                                        <Table hover responsive className="align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Data</th>
                                                    <th>Procedimento</th>
                                                    <th>Valor</th>
                                                    <th>Observacoes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prontuarios.map((item) => (
                                                    <tr key={item.idProntuario}>
                                                        <td>{new Date(`${item.dataRealizacao}T00:00:00`).toLocaleDateString('pt-BR')}</td>
                                                        <td>{item.procedimento?.nome}</td>
                                                        <td><Badge bg="light" text="dark">R$ {Number(item.procedimento?.valor || 0).toFixed(2)}</Badge></td>
                                                        <td>{item.observacoes || 'Sem observacoes'}</td>
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
            )}
        </Container>
    );
}

export default ProntuarioPage;
