import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Alert, Button, Spinner, Table, Container } from 'react-bootstrap';
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

const Dentista = () => {
    const navigate = useNavigate();
    const [dentistas, setDentistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busca, setBusca] = useState('');
    const [excluirId, setExcluirId] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const fetchDentistas = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/dentistas`);
            setDentistas(response.data);
            setError(null);
        } catch {
            setError('Nao foi possivel carregar os dentistas.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDentistas(); }, [fetchDentistas]);

    const confirmarExclusao = async () => {
        if (!excluirId) return;
        setExcluindo(true);
        try {
            await axios.delete(`${API_BASE_URL}/dentistas/${excluirId}`);
            await fetchDentistas();
        } catch (err) {
            setError(tratarErroBackend(err, 'Nao foi possivel deletar o dentista.'));
        } finally {
            setExcluindo(false);
            setExcluirId(null);
        }
    };

    const dentistasFiltrados = useMemo(() => {
        if (!busca.trim()) return dentistas;
        const termo = busca.toLowerCase();
        return dentistas.filter(d =>
            d.nome?.toLowerCase().includes(termo) ||
            d.cro?.includes(termo) ||
            d.especializacao?.toLowerCase().includes(termo) ||
            d.email?.toLowerCase().includes(termo)
        );
    }, [dentistas, busca]);

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Corpo clinico"
                title="Dentistas"
                subtitle="Gerencie CROs, especialidades e dados dos profissionais que atendem na clinica."
                actions={
                    <Button variant="dark" className="rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => navigate('/funcionarios/novo')}>
                        <IconPlus /> Novo Dentista
                    </Button>
                }
            />

            {error && <Alert variant="danger">{error}</Alert>}

            <ListToolbar
                searchValue={busca}
                onSearchChange={setBusca}
                searchPlaceholder="Buscar por nome, CRO ou especializacao"
            />

            {loading ? (
                <div className="loading-shell d-flex flex-column align-items-center justify-content-center">
                    <Spinner animation="border" />
                    <p className="text-muted mt-3 mb-0 small">Carregando dentistas...</p>
                </div>
            ) : dentistasFiltrados.length === 0 ? (
                <Alert variant="info">
                    {busca ? 'Nenhum dentista encontrado para a busca.' : 'Nenhum dentista cadastrado.'}
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
                                            <Button variant="outline-danger" size="sm" className="rounded-pill d-inline-flex align-items-center gap-1" onClick={() => setExcluirId(d.idDentista)}>
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
                titulo="Excluir Dentista"
                mensagem="Tem certeza que deseja excluir este dentista? Esta acao nao pode ser desfeita."
                onConfirm={confirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </Container>
    );
};

export default Dentista;