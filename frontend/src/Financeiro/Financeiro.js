import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, formatarMoeda, tratarErroBackend } from '../ultilitarios/ultilitarios';
import PageHeader from '../components/PageHeader';
import ListToolbar from '../components/ListToolbar';
import './Financeiro.css';

function StatusBadge({ status }) {
    const styles = {
        'PENDENTE': { bg: '#fef3c7', color: '#92400e' },
        'PAGO': { bg: '#d1fae5', color: '#065f46' },
        'CANCELADO': { bg: '#fee2e2', color: '#991b1b' }
    };
    const s = styles[status] || { bg: '#f1f5f9', color: '#475569' };
    return (
        <span className="status-badge" style={{ background: s.bg, color: s.color }}>{status}</span>
    );
}

const IconReceita = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 20l5-5 4 4 11-11"/></svg>;
const IconDespesa = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 20L17 15l-4 4L2 8"/></svg>;
const IconSaldo = () => <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;

const emptyForm = { idLancamento: '', tipo: 'RECEITA', descricao: '', valor: '', data: '', status: 'PENDENTE', observacoes: '' };

function Financeiro() {
    const [lancamentos, setLancamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [excluirId, setExcluirId] = useState(null);
    const [excluindo, setExcluindo] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('TODOS');
    const [filtroTipo, setFiltroTipo] = useState('TODOS');

    const isEdit = useMemo(() => !!form.idLancamento, [form.idLancamento]);

    const fetchLancamentos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/financeiro/lancamentos`);
            setLancamentos(response.data);
            setError(null);
        } catch { setError('Nao foi possivel carregar os lancamentos.'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchLancamentos(); }, [fetchLancamentos]);

    useEffect(() => { if (success) { const t = setTimeout(() => setSuccess(null), 5000); return () => clearTimeout(t); } }, [success]);
    useEffect(() => { if (error) { const t = setTimeout(() => setError(null), 8000); return () => clearTimeout(t); } }, [error]);

    const handleChange = (e) => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); };

    const startEdit = (l) => {
        setSuccess(null); setError(null);
        setForm({ idLancamento: l.idLancamento, tipo: l.tipo || 'RECEITA', descricao: l.descricao || '', valor: l.valor != null ? String(l.valor) : '', data: l.data || '', status: l.status || 'PENDENTE', observacoes: l.observacoes || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => setForm(emptyForm);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSaving(true);
        try {
            const payload = { tipo: form.tipo, descricao: form.descricao, valor: form.valor === '' ? null : form.valor, data: form.data, status: form.status, observacoes: form.observacoes };
            if (isEdit) { await axios.put(`${API_BASE_URL}/financeiro/lancamentos/${form.idLancamento}`, payload); setSuccess('Lancamento atualizado com sucesso.'); }
            else { await axios.post(`${API_BASE_URL}/financeiro/lancamentos`, payload); setSuccess('Lancamento criado com sucesso.'); }
            resetForm(); await fetchLancamentos();
        } catch (err) { setError(tratarErroBackend(err, 'Erro ao salvar lancamento.')); }
        finally { setSaving(false); }
    };

    const confirmarExclusao = async () => {
        if (!excluirId) return; setExcluindo(true);
        try { await axios.delete(`${API_BASE_URL}/financeiro/lancamentos/${excluirId}`); await fetchLancamentos(); }
        catch { setError('Nao foi possivel deletar o lancamento.'); }
        finally { setExcluindo(false); setExcluirId(null); }
    };

    const lancamentosFiltrados = useMemo(() => {
        return lancamentos.filter(l => {
            if (filtroStatus !== 'TODOS' && l.status !== filtroStatus) return false;
            if (filtroTipo !== 'TODOS' && l.tipo !== filtroTipo) return false;
            return true;
        });
    }, [lancamentos, filtroStatus, filtroTipo]);

    const totais = useMemo(() => {
        return lancamentosFiltrados.reduce((acc, l) => {
            const valor = parseFloat(l.valor) || 0;
            if (l.tipo === 'RECEITA' && l.status !== 'CANCELADO') acc.receita += valor;
            if (l.tipo === 'DESPESA' && l.status !== 'CANCELADO') acc.despesa += valor;
            return acc;
        }, { receita: 0, despesa: 0 });
    }, [lancamentosFiltrados]);

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Financeiro"
                title="Gestao Financeira"
                subtitle="Acompanhe receitas, despesas e o saldo da clinica em tempo real."
            />

            {/* Resumo Cards */}
            <Row className="mb-4 g-3">
                <Col sm={4}>
                    <Card className="text-center financeiro-resumo-card receita shadow-sm">
                        <Card.Body>
                            <div className="fin-icon mx-auto"><IconReceita /></div>
                            <p className="fin-label mb-1">Receitas</p>
                            <h4 className="fin-valor mb-0">{formatarMoeda(totais.receita)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4}>
                    <Card className="text-center financeiro-resumo-card despesa shadow-sm">
                        <Card.Body>
                            <div className="fin-icon mx-auto"><IconDespesa /></div>
                            <p className="fin-label mb-1">Despesas</p>
                            <h4 className="fin-valor mb-0">{formatarMoeda(totais.despesa)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4}>
                    <Card className={`text-center financeiro-resumo-card saldo shadow-sm ${(totais.receita - totais.despesa) < 0 ? 'border-danger' : ''}`}>
                        <Card.Body>
                            <div className="fin-icon mx-auto"><IconSaldo /></div>
                            <p className="fin-label mb-1">Saldo</p>
                            <h4 className="fin-valor mb-0">{formatarMoeda(totais.receita - totais.despesa)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <ListToolbar
                searchValue=""
                onSearchChange={() => {}}
                searchPlaceholder="Filtrar lancamentos"
                filterLabel="Status"
                filterValue={filtroStatus}
                onFilterChange={setFiltroStatus}
                filterOptions={[
                    { value: 'TODOS', label: 'Todos os status' },
                    { value: 'PENDENTE', label: 'Pendente' },
                    { value: 'PAGO', label: 'Pago' },
                    { value: 'CANCELADO', label: 'Cancelado' }
                ]}
            />

            <Row className="g-3 mb-3">
                <Col sm="auto">
                    <Form.Select size="sm" style={{ width: 160 }} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                        <option value="TODOS">Todos os tipos</option>
                        <option value="RECEITA">Receita</option>
                        <option value="DESPESA">Despesa</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={5}>
                    <Card className="surface-card">
                        <Card.Body>
                            <Card.Title className="fw-semibold mb-3">{isEdit ? 'Editar Lancamento' : 'Novo Lancamento'}</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Select name="tipo" value={form.tipo} onChange={handleChange} className="toolbar-input">
                                        <option value="RECEITA">Receita</option>
                                        <option value="DESPESA">Despesa</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descricao</Form.Label>
                                    <Form.Control type="text" name="descricao" value={form.descricao} onChange={handleChange} required className="toolbar-input" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Valor</Form.Label>
                                    <Form.Control type="number" step="0.01" min="0" name="valor" value={form.valor} onChange={handleChange} required className="toolbar-input" />
                                </Form.Group>
                                <Row className="g-2 mb-3">
                                    <Col>
                                        <Form.Label>Data</Form.Label>
                                        <Form.Control type="date" name="data" value={form.data} onChange={handleChange} required className="toolbar-input" />
                                    </Col>
                                    <Col>
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select name="status" value={form.status} onChange={handleChange} className="toolbar-input">
                                            <option value="PENDENTE">Pendente</option>
                                            <option value="PAGO">Pago</option>
                                            <option value="CANCELADO">Cancelado</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Observacoes</Form.Label>
                                    <Form.Control as="textarea" rows={2} name="observacoes" value={form.observacoes} onChange={handleChange} className="toolbar-input" />
                                </Form.Group>
                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="dark" className="rounded-pill" disabled={saving}>
                                        {saving ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar')}
                                    </Button>
                                    {isEdit && (
                                        <Button type="button" variant="outline-secondary" onClick={resetForm} disabled={saving} className="rounded-pill">
                                            Cancelar edicao
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
                            <Card.Title className="fw-semibold mb-3">Lancamentos</Card.Title>
                            {loading ? (
                                <div className="text-center my-4"><Spinner animation="border" /></div>
                            ) : (
                                <div className="table-shell">
                                    <Table hover responsive className="mb-0">
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
                                            {lancamentosFiltrados.length === 0 ? (
                                                <tr><td colSpan="6" className="text-center text-muted">Nenhum lancamento cadastrado.</td></tr>
                                            ) : lancamentosFiltrados.map(l => (
                                                <tr key={l.idLancamento}>
                                                    <td>{l.data}</td>
                                                    <td><span className={`status-badge`} style={{ background: l.tipo === 'RECEITA' ? '#d1fae5' : '#fee2e2', color: l.tipo === 'RECEITA' ? '#065f46' : '#991b1b' }}>{l.tipo}</span></td>
                                                    <td>{l.descricao}</td>
                                                    <td className="fw-medium">{formatarMoeda(l.valor)}</td>
                                                    <td><StatusBadge status={l.status} /></td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <Button size="sm" variant="outline-primary" className="rounded-pill" onClick={() => startEdit(l)}>Editar</Button>
                                                            <Button size="sm" variant="outline-danger" className="rounded-pill" onClick={() => setExcluirId(l.idLancamento)}>Excluir</Button>
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
                titulo="Excluir Lancamento"
                mensagem="Tem certeza que deseja excluir este lancamento? Esta acao nao pode ser desfeita."
                onConfirm={confirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </Container>
    );
}

export default Financeiro;
