import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Alert, Button, Container, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, tratarErroBackend } from '../ultilitarios/ultilitarios';
import PageHeader from '../components/PageHeader';
import ListToolbar from '../components/ListToolbar';

const IconEdit = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
const IconTrash = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
    </svg>
);
const IconPlus = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14"/>
    </svg>
);

const Funcionario = () => {
    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busca, setBusca] = useState('');
    const [excluirId, setExcluirId] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const fetchFuncionarios = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/funcionarios`);
            setFuncionarios(response.data);
            setError(null);
        } catch {
            setError('Nao foi possivel carregar os funcionarios.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchFuncionarios(); }, [fetchFuncionarios]);

    const confirmarExclusao = async () => {
        if (!excluirId) return;
        setExcluindo(true);
        try {
            await axios.delete(`${API_BASE_URL}/funcionarios/${excluirId}`);
            await fetchFuncionarios();
        } catch (err) {
            setError(tratarErroBackend(err, 'Nao foi possivel deletar o funcionario.'));
        } finally {
            setExcluindo(false);
            setExcluirId(null);
        }
    };

    const funcionariosFiltrados = useMemo(() => {
        if (!busca.trim()) return funcionarios;
        const termo = busca.toLowerCase();
        return funcionarios.filter(f =>
            f.nmFuncionario?.toLowerCase().includes(termo) ||
            f.nuMatricula?.toString().includes(termo) ||
            f.cargo?.toLowerCase().includes(termo) ||
            f.email?.toLowerCase().includes(termo)
        );
    }, [funcionarios, busca]);

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Equipe interna"
                title="Funcionarios"
                subtitle="Gerencie a equipe administrativa, recepcionistas e demais colaboradores da clinica."
                actions={
                    <Button variant="dark" className="rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => navigate('/funcionarios/novo')}>
                        <IconPlus /> Novo Funcionario
                    </Button>
                }
            />

            {error && <Alert variant="danger">{error}</Alert>}

            <ListToolbar
                searchValue={busca}
                onSearchChange={setBusca}
                searchPlaceholder="Buscar por nome, matricula ou cargo"
            />

            {loading ? (
                <div className="loading-shell d-flex flex-column align-items-center justify-content-center">
                    <Spinner animation="border" />
                    <p className="text-muted mt-3 mb-0 small">Carregando funcionarios...</p>
                </div>
            ) : funcionariosFiltrados.length === 0 ? (
                <Alert variant="info">
                    {busca ? 'Nenhum funcionario encontrado para a busca.' : 'Nenhum funcionario cadastrado.'}
                </Alert>
            ) : (
                <div className="table-shell">
                    <Table hover responsive className="mb-0">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Matricula</th>
                                <th>Cargo</th>
                                <th>Email</th>
                                <th style={{ width: 200 }}>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {funcionariosFiltrados.map(f => (
                                <tr key={f.idFuncionario}>
                                    <td className="fw-medium">{f.nmFuncionario}</td>
                                    <td><span className="badge bg-light text-dark">{f.nuMatricula}</span></td>
                                    <td><span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>{f.cargo}</span></td>
                                    <td>{f.email}</td>
                                    <td>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <Button variant="outline-primary" size="sm" className="rounded-pill d-inline-flex align-items-center gap-1" onClick={() => navigate(`/funcionarios/editar/${f.idFuncionario}`)}>
                                                <IconEdit /> Editar
                                            </Button>
                                            <Button variant="outline-danger" size="sm" className="rounded-pill d-inline-flex align-items-center gap-1" onClick={() => setExcluirId(f.idFuncionario)}>
                                                <IconTrash /> Excluir
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <ConfirmarExclusao
                show={!!excluirId}
                titulo="Excluir Funcionario"
                mensagem="Tem certeza que deseja excluir este funcionario? Esta acao nao pode ser desfeita."
                onConfirm={confirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </Container>
    );
};

export default Funcionario;