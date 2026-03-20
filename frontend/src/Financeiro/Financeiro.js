import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import { API_BASE_URL } from '../config/api';

const emptyForm = {
    idLancamento: '',
    tipo: 'RECEITA',
    descricao: '',
    valor: '',
    data: '',
    status: 'PENDENTE',
    observacoes: ''
};

function Financeiro() {
    const [lancamentos, setLancamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const isEdit = useMemo(() => !!form.idLancamento, [form.idLancamento]);

    const fetchLancamentos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/financeiro/lancamentos`);
            setLancamentos(response.data);
            setError(null);
        } catch (_) {
            setError('Nao foi possivel carregar os lancamentos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLancamentos();
    }, [fetchLancamentos]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const startEdit = (l) => {
        setSuccess(null);
        setError(null);
        setForm({
            idLancamento: l.idLancamento,
            tipo: l.tipo || 'RECEITA',
            descricao: l.descricao || '',
            valor: l.valor != null ? String(l.valor) : '',
            data: l.data || '',
            status: l.status || 'PENDENTE',
            observacoes: l.observacoes || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => setForm(emptyForm);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSaving(true);
        try {
            const payload = {
                tipo: form.tipo,
                descricao: form.descricao,
                valor: form.valor === '' ? null : form.valor,
                data: form.data,
                status: form.status,
                observacoes: form.observacoes
            };

            if (isEdit) {
                await axios.put(`${API_BASE_URL}/financeiro/lancamentos/${form.idLancamento}`, payload);
                setSuccess('Lancamento atualizado com sucesso.');
            } else {
                await axios.post(`${API_BASE_URL}/financeiro/lancamentos`, payload);
                setSuccess('Lancamento criado com sucesso.');
            }

            resetForm();
            await fetchLancamentos();
        } catch (err) {
            const msg = err.response?.data || 'Erro ao salvar lancamento.';
            setError(typeof msg === 'string' ? msg : 'Erro ao salvar lancamento.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        setError(null);
        setSuccess(null);
        try {
            await axios.delete(`${API_BASE_URL}/financeiro/lancamentos/${id}`);
            await fetchLancamentos();
        } catch (_) {
            setError('Nao foi possivel deletar o lancamento.');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="g-4">
                <Col lg={5}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>{isEdit ? 'Editar Lancamento' : 'Novo Lancamento'}</Card.Title>
                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                            {success && <Alert variant="success" className="mt-3">{success}</Alert>}

                            <Form className="mt-3" onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Select name="tipo" value={form.tipo} onChange={handleChange}>
                                        <option value="RECEITA">Receita</option>
                                        <option value="DESPESA">Despesa</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descricao</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="descricao"
                                        value={form.descricao}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Valor</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="valor"
                                        value={form.valor}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="data"
                                        value={form.data}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select name="status" value={form.status} onChange={handleChange}>
                                        <option value="PENDENTE">Pendente</option>
                                        <option value="PAGO">Pago</option>
                                        <option value="CANCELADO">Cancelado</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Observacoes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="observacoes"
                                        value={form.observacoes}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="primary" disabled={saving}>
                                        {saving ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
                                    </Button>
                                    {isEdit && (
                                        <Button type="button" variant="secondary" onClick={resetForm} disabled={saving}>
                                            Cancelar edicao
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={7}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>Lancamentos</Card.Title>
                            {loading ? (
                                <div className="text-center my-4"><Spinner animation="border" /></div>
                            ) : (
                                <Table striped bordered hover responsive className="mt-3 mb-0">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Tipo</th>
                                            <th>Descricao</th>
                                            <th>Valor</th>
                                            <th>Status</th>
                                            <th style={{ width: 180 }}>Acoes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lancamentos.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted">Nenhum lancamento cadastrado.</td>
                                            </tr>
                                        ) : lancamentos.map(l => (
                                            <tr key={l.idLancamento}>
                                                <td>{l.data}</td>
                                                <td>{l.tipo}</td>
                                                <td>{l.descricao}</td>
                                                <td>{l.valor}</td>
                                                <td>{l.status}</td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button size="sm" variant="info" onClick={() => startEdit(l)}>Editar</Button>
                                                        <Button size="sm" variant="danger" onClick={() => handleDelete(l.idLancamento)}>Excluir</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Financeiro;
