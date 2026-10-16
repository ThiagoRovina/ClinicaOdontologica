import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Alert, Button, Container, Nav, Spinner, Table } from 'react-bootstrap';
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
    const [aba, setAba] = useState('funcionarios');

    // --- Funcionarios ---
    const [funcionarios, setFuncionarios] = useState([]);
    const [loadingFunc, setLoadingFunc] = useState(true);
    const [errorFunc, setErrorFunc] = useState(null);
    const [buscaFunc, setBuscaFunc] = useState('');
    const [excluirFuncId, setExcluirFuncId] = useState(null);
    const [excluindoFunc, setExcluindoFunc] = useState(false);

    const fetchFuncionarios = useCallback(async () => {
        try {
            setLoadingFunc(true);
            const response = await axios.get(`${API_BASE_URL}/funcionarios`);
            setFuncionarios(response.data);
            setErrorFunc(null);
        } catch {
            setErrorFunc('Nao foi possivel carregar os funcionarios.');
        } finally {
            setLoadingFunc(false);
        }
    }, []);

    useEffect(() => { fetchFuncionarios(); }, [fetchFuncionarios]);

    const confirmarExclusaoFunc = async () => {
        if (!excluirFuncId) return;
        setExcluindoFunc(true);
        try {
            await axios.delete(`${API_BASE_URL}/funcionarios/${excluirFuncId}`);
            await fetchFuncionarios();
        } catch (err) {
            setErrorFunc(tratarErroBackend(err, 'Nao foi possivel deletar o funcionario.'));
        } finally {
            setExcluindoFunc(false);
            setExcluirFuncId(null);
        }
    };

    const funcionariosFiltrados = useMemo(() => {
        if (!buscaFunc.trim()) return funcionarios;
        const termo = buscaFunc.toLowerCase();
        return funcionarios.filter(f =>
            f.nmFuncionario?.toLowerCase().includes(termo) ||
            f.nuMatricula?.toString().includes(termo) ||
            f.cargo?.toLowerCase().includes(termo) ||
            f.email?.toLowerCase().includes(termo)
        );
    }, [funcionarios, buscaFunc]);

    // --- Dentistas ---
    const [dentistas, setDentistas] = useState([]);
    const [loadingDent, setLoadingDent] = useState(false);
    const [errorDent, setErrorDent] = useState(null);
    const [buscaDent, setBuscaDent] = useState('');
    const [excluirDentId, setExcluirDentId] = useState(null);
    const [excluindoDent, setExcluindoDent] = useState(false);

    const fetchDentistas = useCallback(async () => {
        try {
            setLoadingDent(true);
            const response = await axios.get(`${API_BASE_URL}/dentistas`);
            setDentistas(response.data);
            setErrorDent(null);
        } catch {
            setErrorDent('Nao foi possivel carregar os dentistas.');
        } finally {
            setLoadingDent(false);
        }
    }, []);

    useEffect(() => {
        if (aba === 'dentistas') fetchDentistas();
    }, [aba, fetchDentistas]);

    const confirmarExclusaoDent = async () => {
        if (!excluirDentId) return;
        setExcluindoDent(true);
        try {
            await axios.delete(`${API_BASE_URL}/dentistas/${excluirDentId}`);
            await fetchDentistas();
        } catch (err) {
            setErrorDent(tratarErroBackend(err, 'Nao foi possivel deletar o dentista.'));
        } finally {
            setExcluindoDent(false);
            setExcluirDentId(null);
        }
    };

    const dentistasFiltrados = useMemo(() => {
        if (!buscaDent.trim()) return dentistas;
        const termo = buscaDent.toLowerCase();
        return dentistas.filter(d =>
            d.nome?.toLowerCase().includes(termo) ||
            d.cro?.includes(termo) ||
            d.especializacao?.toLowerCase().includes(termo) ||
            d.email?.toLowerCase().includes(termo)
        );
    }, [dentistas, buscaDent]);

    const tabAction = aba === 'funcionarios'
        ? <Button variant="dark" className="rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => navigate('/funcionarios/novo')}><IconPlus /> Novo Funcionario</Button>
        : null;

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Equipe interna"
                title="Funcionarios"
                subtitle="Gerencie a equipe e o corpo clinico da clinica."
                actions={tabAction}
            />

            <Nav variant="tabs" className="mb-4" activeKey={aba} onSelect={setAba}>
                <Nav.Item>
                    <Nav.Link eventKey="funcionarios">Funcionarios</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="dentistas">Dentistas</Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Aba Funcionarios */}
            {aba === 'funcionarios' && (
                <>
                    {errorFunc && <Alert variant="danger">{errorFunc}</Alert>}
                    <ListToolbar
                        searchValue={buscaFunc}
                        onSearchChange={setBuscaFunc}
                        searchPlaceholder="Buscar por nome, matricula ou cargo"
                    />
                    {loadingFunc ? (
                        <div className="loading-shell d-flex flex-column align-items-center justify-content-center">
                            <Spinner animation="border" />
                            <p className="text-muted mt-3 mb-0 small">Carregando funcionarios...</p>
                        </div>
                    ) : funcionariosFiltrados.length === 0 ? (
                        <Alert variant="info">
                            {buscaFunc ? 'Nenhum funcionario encontrado para a busca.' : 'Nenhum funcionario cadastrado.'}
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
                                                    <Button variant="outline-danger" size="sm" className="rounded-pill d-inline-flex align-items-center gap-1" onClick={() => setExcluirFuncId(f.idFuncionario)}>
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
                        show={!!excluirFuncId}
                        titulo="Excluir Funcionario"
                        mensagem="Tem certeza que deseja excluir este funcionario? Esta acao nao pode ser desfeita."
                        onConfirm={confirmarExclusaoFunc}
                        onCancel={() => setExcluirFuncId(null)}
                        loading={excluindoFunc}
                    />
                </>
            )}

            {/* Aba Dentistas */}
            {aba === 'dentistas' && (
                <>
                    {errorDent && <Alert variant="danger">{errorDent}</Alert>}
                    <ListToolbar
                        searchValue={buscaDent}
                        onSearchChange={setBuscaDent}
                        searchPlaceholder="Buscar por nome, CRO ou especializacao"
                    />
                    {loadingDent ? (
                        <div className="loading-shell d-flex flex-column align-items-center justify-content-center">
                            <Spinner animation="border" />
                            <p className="text-muted mt-3 mb-0 small">Carregando dentistas...</p>
                        </div>
                    ) : dentistasFiltrados.length === 0 ? (
                        <Alert variant="info">
                            {buscaDent ? 'Nenhum dentista encontrado para a busca.' : 'Nenhum dentista cadastrado.'}
                        </Alert>
                    ) : (
                        <div className="table-shell">
                            <Table hover responsive className="mb-0">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>CRO</th>
                                        <th>Especializacao</th>
                                        <th>Email</th>
                                        <th style={{ width: 200 }}>Acoes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dentistasFiltrados.map(d => (
                                        <tr key={d.idDentista}>
                                            <td className="fw-medium">{d.nome}</td>
                                            <td><span className="badge bg-light text-dark">{d.cro}</span></td>
                                            <td>{d.especializacao}</td>
                                            <td>{d.email}</td>
                                            <td>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <Button variant="outline-primary" size="sm" className="rounded-pill d-inline-flex align-items-center gap-1" onClick={() => navigate(`/dentistas/editar/${d.idDentista}`)}>
                                                        <IconEdit /> Editar
                                                    </Button>
                                                    <Button variant="outline-danger" size="sm" className="rounded-pill d-inline-flex align-items-center gap-1" onClick={() => setExcluirDentId(d.idDentista)}>
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
                        show={!!excluirDentId}
                        titulo="Excluir Dentista"
                        mensagem="Tem certeza que deseja excluir este dentista? Esta acao nao pode ser desfeita."
                        onConfirm={confirmarExclusaoDent}
                        onCancel={() => setExcluirDentId(null)}
                        loading={excluindoDent}
                    />
                </>
            )}
        </Container>
    );
};

export default Funcionario;