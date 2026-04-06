import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, formatarMoeda, tratarErroBackend } from '../ultilitarios/ultilitarios';

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
        } catch {
            setError('Não foi possível carregar os lançamentos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLancamentos();
    }, [fetchLancamentos]);

    // Auto-dismiss alertas
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 8000);
            return () => clearTimeout(timer);
        }
    }, [error]);

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
                setSuccess('Lançamento atualizado com sucesso.');
            } else {
                await axios.post(`${API_BASE_URL}/financeiro/lancamentos`, payload);
                setSuccess('Lançamento criado com sucesso.');
            }

            resetForm();
            await fetchLancamentos();
        } catch (err) {
            setError(tratarErroBackend(err, 'Erro ao salvar lançamento.'));
        } finally {
            setSaving(false);
        }
    };

    const confirmarExclusao = async () => {
        if (!excluirId) return;
        setExcluindo(true);
        try {
            await axios.delete(`${API_BASE_URL}/financeiro/lancamentos/${excluirId}`);
            await fetchLancamentos();
        } catch {
            setError('Não foi possível deletar o lançamento.');
        } finally {
            setExcluindo(false);
            setExcluirId(null);
        }
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
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Gestão Financeira</h2>
            </div>

            {/* Cards de resumo */}
            <Row className="mb-4 g-3">
                <Col sm={4}>
                    <Card className={`text-center ${totais.receita > 0 ? 'border-success' : ''}`}>
                        <Card.Body>
                            <Card.Title className="text-success mb-1">Receitas</Card.Title>
                            <h4 className="text-success mb-0">{formatarMoeda(totais.receita)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4}>
                    <Card className={`text-center ${totais.despesa > 0 ? 'border-danger' : ''}`}>
                        <Card.Body>
                            <Card.Title className="text-danger mb-1">Despesas</Card.Title>
                            <h4 className="text-danger mb-0">{formatarMoeda(totais.despesa)}</h4>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4}>
                    <Card className={`text-center ${(totais.receita - totais.despesa) >= 0 ? 'border-primary' : 'border-danger'}`}>
                        <Card.Body>
                            <Card.Title className="mb-1">Saldo</Card.Title>
                            <h4 className={`mb-0 ${(totais.receita - totais.despesa) >= 0 ? 'text-primary' : 'text-danger'}`}>
                                {formatarMoeda(totais.receita - totais.despesa)}
                            </h4>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filtros da tabela */}
            <Row className="mb-3 g-2">
                <Col sm="auto">
                    <Form.Select size="sm" style={{ width: 160 }} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
                        <option value="TODOS">Todos os status</option>
                        <option value="PENDENTE">Pendente</option>
                        <option value="PAGO">Pago</option>
                        <option value="CANCELADO">Cancelado</option>
                    </Form.Select>
                </Col>
                <Col sm="auto">
                    <Form.Select size="sm" style={{ width: 140 }} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
                        <option value="TODOS">Todos os tipos</option>
                        <option value="RECEITA">Receita</option>
                        <option value="DESPESA">Despesa</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={5}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title>{isEdit ? 'Editar Lançamento' : 'Novo Lançamento'}</Card.Title>

                            <Form className="mt-3" onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo</Form.Label>
                                    <Form.Select name="tipo" value={form.tipo} onChange={handleChange}>
                                        <option value="RECEITA">Receita</option>
                                        <option value="DESPESA">Despesa</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="descricao"
                                        value={form.descricao}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Valor (R$)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        min="0"
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
                                    <Form.Label>Observações</Form.Label>
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
                                            Cancelar edição
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
                            <Card.Title>Lançamentos</Card.Title>
                            {loading ? (
                                <div className="text-center my-4"><Spinner animation="border" /></div>
                            ) : (
                                <Table striped bordered hover responsive className="mt-3 mb-0">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Tipo</th>
                                            <th>Descrição</th>
                                            <th>Valor</th>
                                            <th>Status</th>
                                            <th style={{ width: 180 }}>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lancamentosFiltrados.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted">Nenhum lançamento cadastrado.</td>
                                            </tr>
                                        ) : lancamentosFiltrados.map(l => (
                                            <tr key={l.idLancamento}>
                                                <td>{l.data}</td>
                                                <td>{l.tipo}</td>
                                                <td>{l.descricao}</td>
                                                <td>{formatarMoeda(l.valor)}</td>
                                                <td>
                                                    <StatusBadge status={l.status} />
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Button size="sm" variant="outline-info" onClick={() => startEdit(l)}>Editar</Button>
                                                        <Button size="sm" variant="outline-danger" onClick={() => setExcluirId(l.idLancamento)}>Excluir</Button>
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

            <ConfirmarExclusao
                show={!!excluirId}
                titulo="Excluir Lançamento"
                mensagem="Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita."
                onConfirm={confirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </Container>
    );
}

function StatusBadge({ status }) {
    const map = {
        'PENDENTE': 'warning',
        'PAGO': 'success',
        'CANCELADO': 'danger'
    };
    const labels = {
        'PENDENTE': 'Pendente',
        'PAGO': 'Pago',
        'CANCELADO': 'Cancelado'
    };
    return (
        <span className={`badge bg-${map[status] || 'secondary'}`}>
            {labels[status] || status}
        </span>
    );
}

export default Financeiro;