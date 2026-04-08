import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, formatarMoeda } from '../ultilitarios/ultilitarios';
import PageHeader from '../components/PageHeader';
import ListToolbar from '../components/ListToolbar';

const emptyForm = { idProcedimento: '', nome: '', descricao: '', valor: '' };

function Procedimentos() {
    const [procedimentos, setProcedimentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [excluirId, setExcluirId] = useState(null);
    const [excluindo, setExcluindo] = useState(false);
    const [busca, setBusca] = useState('');

    const isEdit = useMemo(() => !!form.idProcedimento, [form.idProcedimento]);

    const fetchProcedimentos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/procedimentos`);
            setProcedimentos(response.data);
            setError(null);
        } catch { setError('Nao foi possivel carregar os procedimentos.'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProcedimentos(); }, [fetchProcedimentos]);

    useEffect(() => { if (success) { const t = setTimeout(() => setSuccess(null), 5000); return () => clearTimeout(t); } }, [success]);
    useEffect(() => { if (error) { const t = setTimeout(() => setError(null), 8000); return () => clearTimeout(t); } }, [error]);

    const handleChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); };

    const startEdit = (p) => {
        setSuccess(null); setError(null);
        setForm({ idProcedimento: p.idProcedimento, nome: p.nome || '', descricao: p.descricao || '', valor: p.valor != null ? String(p.valor) : '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => setForm(emptyForm);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); setSuccess(null); setSaving(true);
        try {
            const payload = { nome: form.nome, descricao: form.descricao, valor: form.valor === '' ? null : form.valor };
            if (isEdit) { await axios.put(`${API_BASE_URL}/procedimentos/${form.idProcedimento}`, payload); setSuccess('Procedimento atualizado com sucesso.'); }
            else { await axios.post(`${API_BASE_URL}/procedimentos`, payload); setSuccess('Procedimento criado com sucesso.'); }
            resetForm(); await fetchProcedimentos();
        } catch { setError('Erro ao salvar procedimento.'); }
        finally { setSaving(false); }
    };

    const confirmarExclusao = async () => {
        if (!excluirId) return;
        setExcluindo(true);
        try { await axios.delete(`${API_BASE_URL}/procedimentos/${excluirId}`); await fetchProcedimentos(); }
        catch { setError('Nao foi possivel deletar o procedimento.'); }
        finally { setExcluindo(false); setExcluirId(null); }
    };

    const procedimentosFiltrados = useMemo(() => {
        if (!busca.trim()) return procedimentos;
        const termo = busca.toLowerCase();
        return procedimentos.filter(p => p.nome?.toLowerCase().includes(termo) || p.descricao?.toLowerCase().includes(termo));
    }, [procedimentos, busca]);

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Catalogo"
                title="Procedimentos"
                subtitle="Cadastre servicos com nome, descricao e valor para organizar o prontuario e estimar faturamento."
            />

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <ListToolbar
                searchValue={busca}
                onSearchChange={setBusca}
                searchPlaceholder="Buscar procedimento..."
            />

            <Row className="g-4">
                <Col lg={5}>
                    <Card className="surface-card">
                        <Card.Body>
                            <Card.Title className="fw-semibold mb-3">{isEdit ? 'Editar Procedimento' : 'Novo Procedimento'}</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="text" name="nome" value={form.nome} onChange={handleChange} required className="toolbar-input" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descricao</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="descricao" value={form.descricao} onChange={handleChange} className="toolbar-input" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Valor (R$)</Form.Label>
                                    <Form.Control type="number" step="0.01" min="0" name="valor" value={form.valor} onChange={handleChange} required className="toolbar-input" />
                                </Form.Group>
                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="dark" className="rounded-pill" disabled={saving}>
                                        {saving ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
                                    </Button>
                                    {isEdit && (
                                        <Button type="button" variant="outline-secondary" onClick={resetForm} disabled={saving} className="rounded-pill">
                                            Voltar
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={7}>
                    <Card className="surface-card">
                        <Card.Body>
                            <Card.Title className="fw-semibold mb-3">Procedimentos</Card.Title>
                            {loading ? (
                                <div className="text-center my-4"><Spinner animation="border" /></div>
                            ) : (
                                <div className="table-shell">
                                    <Table hover responsive className="mb-0">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Descricao</th>
                                                <th>Valor</th>
                                                <th style={{ width: 180 }}>Acoes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {procedimentosFiltrados.length === 0 ? (
                                                <tr><td colSpan="4" className="text-center text-muted">Nenhum procedimento cadastrado.</td></tr>
                                            ) : procedimentosFiltrados.map(p => (
                                                <tr key={p.idProcedimento}>
                                                    <td className="fw-medium">{p.nome}</td>
                                                    <td className="small text-muted">{p.descricao}</td>
                                                    <td className="fw-semibold">{formatarMoeda(p.valor)}</td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button size="sm" variant="outline-primary" className="rounded-pill" onClick={() => startEdit(p)}>Editar</Button>
                                                            <Button size="sm" variant="outline-danger" className="rounded-pill" onClick={() => setExcluirId(p.idProcedimento)}>Excluir</Button>
                                                        </div>
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

            <ConfirmarExclusao
                show={!!excluirId}
                titulo="Excluir Procedimento"
                mensagem="Tem certeza que deseja excluir este procedimento? Esta acao nao pode ser desfeita."
                onConfirm={confirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </Container>
    );
}

export default Procedimentos;