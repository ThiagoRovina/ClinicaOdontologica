import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Tab, Table, Tabs } from 'react-bootstrap';
import { API_BASE_URL, extrairErro } from '../config/api';
import { ConfirmarExclusao } from '../ultilitarios/ultilitarios';
import { Odontograma } from '../components/Odontograma';
import '../components/Odontograma.css';

const emptyForm = {
    titulo: '',
    idDentista: '',
    idProcedimento: '',
    dataRealizacao: '',
    observacoes: ''
};

function ProntuarioPaciente() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [paciente, setPaciente] = useState(null);
    const [prontuarios, setProntuarios] = useState([]);
    const [dentistas, setDentistas] = useState([]);
    const [procedimentos, setProcedimentos] = useState([]);

    // Odontograma state
    const [denticao, setDenticao] = useState({});
    const [procedimentoSelecionado, setProcedimentoSelecionado] = useState('CARIE');
    const [salvandoDente, setSalvandoDente] = useState(false);

    const [consultas, setConsultas] = useState([]);
    const [lancamentos, setLancamentos] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [excluirId, setExcluirId] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const canSubmit = useMemo(() => !!form.titulo && !!form.dataRealizacao, [form.titulo, form.dataRealizacao]);

    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            const [pacienteRes, prontRes, dentRes, procRes, denticaoRes, consultasRes, lancamentosRes] = await Promise.allSettled([
                axios.get(`${API_BASE_URL}/pacientes/${id}`),
                axios.get(`${API_BASE_URL}/prontuarios/paciente/${id}`),
                axios.get(`${API_BASE_URL}/dentistas`),
                axios.get(`${API_BASE_URL}/procedimentos`),
                // Tenta carregar a dentiçao (endpoint pode não existir ainda)
                axios.get(`${API_BASE_URL}/denticao/paciente/${id}`).catch(() => ({ data: {} })),
                axios.get(`${API_BASE_URL}/consultas/paciente/${id}`),
                axios.get(`${API_BASE_URL}/financeiro/lancamentos/paciente/${id}`)
            ]);

            if (pacienteRes.status === 'fulfilled') setPaciente(pacienteRes.value.data);
            if (prontRes.status === 'fulfilled') setProntuarios(prontRes.value.data);
            if (dentRes.status === 'fulfilled') setDentistas(dentRes.value.data);
            if (procRes.status === 'fulfilled') setProcedimentos(procRes.value.data);
            if (denticaoRes.status === 'fulfilled' && denticaoRes.value.data) {
                // Formato esperado: { denticao: { [numDente]: { [face]: { tipo, observacao } } } }
                setDenticao(denticaoRes.value.data.denticao || denticaoRes.value.data || {});
            }
            if (consultasRes.status === 'fulfilled') setConsultas(consultasRes.value.data);
            if (lancamentosRes.status === 'fulfilled') setLancamentos(lancamentosRes.value.data);

            setError(null);
        } catch (err) {
            setError(extrairErro(err, 'Não foi possível carregar o prontuário.'));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Auto-dismiss alertas
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!canSubmit) {
            setError('Preencha título e data.');
            return;
        }

        setSaving(true);
        try {
            await axios.post(`${API_BASE_URL}/prontuarios`, {
                titulo: form.titulo,
                pacienteId: parseInt(id),
                dentistaId: form.idDentista ? parseInt(form.idDentista) : null,
                procedimentoId: form.idProcedimento ? parseInt(form.idProcedimento) : null,
                dataRealizacao: form.dataRealizacao,
                observacoes: form.observacoes
            });
            setForm(emptyForm);
            setSuccess('Registro adicionado ao prontuário.');
            await fetchAll();
        } catch (err) {
            setError(extrairErro(err, 'Erro ao salvar prontuário.'));
        } finally {
            setSaving(false);
        }
    };

    // Handler click no dente — tipo=null limpa a face
    const handleMarcarDente = useCallback((dente, face, tipo) => {
        setDenticao(prev => {
            const novo = { ...prev };
            if (tipo === null) {
                if (novo[dente]) {
                    const faces = { ...novo[dente] };
                    delete faces[face];
                    if (Object.keys(faces).length === 0) delete novo[dente];
                    else novo[dente] = faces;
                }
            } else {
                if (!novo[dente]) novo[dente] = {};
                novo[dente] = { ...novo[dente], [face]: { tipo, observacao: '' } };
            }
            axios.put(`${API_BASE_URL}/denticao/paciente/${id}`, { denticao: novo }, { withCredentials: true })
                .catch(() => {});
            return novo;
        });
    }, [id]);

    const handleConfirmarExclusao = async () => {
        if (!excluirId) return;
        setExcluindo(true);
        try {
            await axios.delete(`${API_BASE_URL}/prontuarios/${excluirId}`);
            await fetchAll();
        } catch {
            setError('Não foi possível excluir o registro do prontuário.');
        } finally {
            setExcluindo(false);
            setExcluirId(null);
        }
    };

    return (
        <Container className="mt-4">
            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <div>
                    <h2 className="mb-1">Prontuário do Paciente</h2>
                    {paciente && (
                        <div className="text-muted">
                            {paciente.nome} — CPF: {paciente.cpf} — Tel: {paciente.telefone}
                        </div>
                    )}
                </div>
                <Button variant="outline-secondary" onClick={() => navigate('/pacientes')}>Voltar</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {loading ? (
                <div className="text-center my-5"><Spinner animation="border" /></div>
            ) : (
                <Tabs defaultActiveKey="odontograma" className="mb-3" variant="tabs">
                    <Tab eventKey="odontograma" title="Odontograma">
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white fw-semibold">
                                Odontograma — Dentição Permanente
                            </Card.Header>
                            <Card.Body>
                                <Odontograma
                                    denticao={denticao}
                                    onMarcar={handleMarcarDente}
                                    editavel={true}
                                    procedimentoSelecionado={procedimentoSelecionado}
                                    onTrocarProcedimento={setProcedimentoSelecionado}
                                />
                            </Card.Body>
                        </Card>
                    </Tab>

                    <Tab eventKey="registros" title="Registros Clínicos">
                        <Row className="g-4">
                            <Col lg={5}>
                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <Card.Title>Novo Registro</Card.Title>
                                        <Form className="mt-3" onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Título</Form.Label>
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
                                                <Form.Label>Observações</Form.Label>
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
                                        <Card.Title>Histórico</Card.Title>
                                        <Table striped bordered hover responsive className="mt-3 mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Data</th>
                                                    <th>Título</th>
                                                    <th>Dentista</th>
                                                    <th>Procedimento</th>
                                                    <th style={{ width: 120 }}>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {prontuarios.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="text-center text-muted">Nenhum registro no prontuário.</td>
                                                    </tr>
                                                ) : prontuarios.map(p => (
                                                    <tr key={p.idProntuario}>
                                                        <td>{p.dataRealizacao}</td>
                                                        <td>{p.titulo}</td>
                                                        <td>{p.dentistaNome || '-'}</td>
                                                        <td>{p.procedimento?.nome || '-'}</td>
                                                        <td>
                                                            <Button size="sm" variant="outline-danger" onClick={() => setExcluirId(p.idProntuario)}>Excluir</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab>

                    <Tab eventKey="historico" title="Histórico">
                        <Row className="g-4">
                            <Col lg={6}>
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-white fw-semibold">Consultas</Card.Header>
                                    <Card.Body>
                                        <Table responsive hover size="sm" className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Data/Hora</th>
                                                    <th>Dentista</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {consultas.length === 0 ? (
                                                    <tr><td colSpan="3" className="text-center text-muted">Nenhuma consulta registrada.</td></tr>
                                                ) : consultas.map(c => (
                                                    <tr key={c.idConsulta}>
                                                        <td>{c.dataHora ? new Date(c.dataHora).toLocaleString('pt-BR') : '-'}</td>
                                                        <td>{c.dentista?.nome || '-'}</td>
                                                        <td><span className="badge bg-secondary">{c.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={6}>
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-white fw-semibold">Financeiro</Card.Header>
                                    <Card.Body>
                                        <Table responsive hover size="sm" className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Data</th>
                                                    <th>Descrição</th>
                                                    <th>Valor</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lancamentos.length === 0 ? (
                                                    <tr><td colSpan="4" className="text-center text-muted">Nenhum lançamento financeiro.</td></tr>
                                                ) : lancamentos.map(l => (
                                                    <tr key={l.idLancamento}>
                                                        <td>{l.data}</td>
                                                        <td>{l.descricao}</td>
                                                        <td className="fw-medium">R$ {Number(l.valor || 0).toFixed(2)}</td>
                                                        <td><span className={`badge ${l.status === 'PAGO' ? 'bg-success' : l.status === 'CANCELADO' ? 'bg-danger' : 'bg-warning text-dark'}`}>{l.status}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            )}

            <ConfirmarExclusao
                show={!!excluirId}
                titulo="Excluir Registro do Prontuário"
                mensagem="Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita."
                onConfirm={handleConfirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </Container>
    );
}


export default ProntuarioPaciente;