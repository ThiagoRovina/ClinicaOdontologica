import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import api from '../api';
import ConfirmActionModal from '../components/ConfirmActionModal';
import ListToolbar from '../components/ListToolbar';
import PageHeader from '../components/PageHeader';
import PaginationBar from '../components/PaginationBar';

const ITEMS_PER_PAGE = 5;

function Procedimento() {
    const navigate = useNavigate();
    const [procedimentos, setProcedimentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [procedimentoParaExcluir, setProcedimentoParaExcluir] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const fetchProcedimentos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/procedimentos');
            setProcedimentos(response.data);
            setError(null);
        } catch (err) {
            setError('Nao foi possivel carregar os procedimentos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProcedimentos();
    }, [fetchProcedimentos]);

    const filteredProcedimentos = useMemo(() => {
        const term = search.toLowerCase();
        return procedimentos.filter((procedimento) =>
            [procedimento.nome, procedimento.descricao]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(term))
        );
    }, [procedimentos, search]);

    const totalPages = Math.max(1, Math.ceil(filteredProcedimentos.length / ITEMS_PER_PAGE));
    const paginatedProcedimentos = filteredProcedimentos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/procedimentos/${procedimentoParaExcluir.idProcedimento}`);
            setProcedimentoParaExcluir(null);
            setFeedback({ type: 'success', message: 'Procedimento removido com sucesso.' });
            fetchProcedimentos();
        } catch (err) {
            setError(err.response?.data?.message || 'Nao foi possivel excluir o procedimento.');
        }
    };

    return (
        <div className="page-shell">
            <PageHeader
                eyebrow="Financeiro clinico"
                title="Procedimentos"
                subtitle="Mantenha a tabela de servicos organizada com nome, descricao e valor."
                actions={<Button variant="dark" className="rounded-pill px-4" onClick={() => navigate('/procedimentos/novo')}>Novo procedimento</Button>}
            />

            {loading && <div className="loading-shell"><Spinner animation="border" /></div>}
            {feedback && <Alert variant={feedback.type}>{feedback.message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && (
                <ListToolbar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Busque por nome ou descricao"
                />
            )}

            {!loading && !error && filteredProcedimentos.length === 0 && (
                <Alert variant="info">Nenhum procedimento cadastrado.</Alert>
            )}

            {!loading && !error && filteredProcedimentos.length > 0 && (
                <div className="table-shell">
                    <Table hover responsive className="align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Descricao</th>
                                <th>Valor</th>
                                <th>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProcedimentos.map((procedimento) => (
                                <tr key={procedimento.idProcedimento}>
                                    <td>{procedimento.nome}</td>
                                    <td>{procedimento.descricao || 'Sem descricao'}</td>
                                    <td><Badge bg="light" text="dark">R$ {Number(procedimento.valor).toFixed(2)}</Badge></td>
                                    <td>
                                        <Button variant="info" size="sm" className="me-2" onClick={() => navigate(`/procedimentos/editar/${procedimento.idProcedimento}`)}>Editar</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => setProcedimentoParaExcluir(procedimento)}>Excluir</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            <ConfirmActionModal
                show={!!procedimentoParaExcluir}
                title="Excluir procedimento"
                body={`Deseja realmente excluir ${procedimentoParaExcluir?.nome || 'este procedimento'}?`}
                onCancel={() => setProcedimentoParaExcluir(null)}
                onConfirm={handleDelete}
                confirmLabel="Excluir procedimento"
            />
        </div>
    );
}

export default Procedimento;
