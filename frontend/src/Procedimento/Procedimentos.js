import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import { API_BASE_URL } from '../config/api';

const emptyForm = {
    idProcedimento: '',
    nome: '',
    descricao: '',
    valor: ''
};

function Procedimentos() {
    const [procedimentos, setProcedimentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const isEdit = useMemo(() => !!form.idProcedimento, [form.idProcedimento]);

    const fetchProcedimentos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/procedimentos`);
            setProcedimentos(response.data);
            setError(null);
        } catch (_) {
            setError('Nao foi possivel carregar os procedimentos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProcedimentos();
    }, [fetchProcedimentos]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const startEdit = (p) => {
        setSuccess(null);
        setError(null);
        setForm({
            idProcedimento: p.idProcedimento,
            nome: p.nome || '',
            descricao: p.descricao || '',
            valor: p.valor != null ? String(p.valor) : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setForm(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSaving(true);
        try {
            const payload = {
                nome: form.nome,
                descricao: form.descricao,
                valor: form.valor === '' ? null : form.valor
            };

            if (isEdit) {
                await axios.put(`${API_BASE_URL}/procedimentos/${form.idProcedimento}`, payload);
                setSuccess('Procedimento atualizado com sucesso.');
            } else {
                await axios.post(`${API_BASE_URL}/procedimentos`, payload);
                setSuccess('Procedimento criado com sucesso.');
            }

            resetForm();
            await fetchProcedimentos();
        } catch (_) {
            setError('Erro ao salvar procedimento. Verifique os campos e tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        setError(null);
        setSuccess(null);
        try {
            await axios.delete(`${API_BASE_URL}/procedimentos/${id}`);
            await fetchProcedimentos();
        } catch (_) {
            setError('Nao foi possivel deletar o procedimento.');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="g-4">
                <Col lg={5}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>{isEdit ? 'Editar Procedimento' : 'Novo Procedimento'}</Card.Title>
                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                            {success && <Alert variant="success" className="mt-3">{success}</Alert>}

                            <Form className="mt-3" onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nome"
                                        value={form.nome}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descricao</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="descricao"
                                        value={form.descricao}
                                        onChange={handleChange}
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
                            <Card.Title>Procedimentos</Card.Title>
                            {loading ? (
                                <div className="text-center my-4"><Spinner animation="border" /></div>
                            ) : (
                                <Table striped bordered hover responsive className="mt-3 mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Valor</th>
                                            <th style={{ width: 180 }}>Acoes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {procedimentos.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="text-center text-muted">Nenhum procedimento cadastrado.</td>
                                            </tr>
                                        ) : procedimentos.map(p => (
                                            <tr key={p.idProcedimento}>
                                                <td>{p.nome}</td>
                                                <td>{p.valor}</td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button size="sm" variant="info" onClick={() => startEdit(p)}>Editar</Button>
                                                        <Button size="sm" variant="danger" onClick={() => handleDelete(p.idProcedimento)}>Excluir</Button>
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

export default Procedimentos;
