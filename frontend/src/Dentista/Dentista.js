import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ConfirmActionModal from '../components/ConfirmActionModal';
import ListToolbar from '../components/ListToolbar';
import PageHeader from '../components/PageHeader';
import PaginationBar from '../components/PaginationBar';

const ITEMS_PER_PAGE = 5;

const Dentista = () => {
    const navigate = useNavigate();
    const [dentistas, setDentistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [especializacao, setEspecializacao] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dentistaParaExcluir, setDentistaParaExcluir] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const fetchDentistas = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/dentistas');
            setDentistas(response.data);
            setError(null);
        } catch (err) {
            setError("Não foi possível carregar os dentistas.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDentistas();
    }, [fetchDentistas]);

    const filteredDentistas = useMemo(() => {
        return dentistas.filter((dentista) => {
            const matchesSearch = [dentista.nome, dentista.cro, dentista.email]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(search.toLowerCase()));
            const matchesEspecializacao = !especializacao || dentista.especializacao === especializacao;
            return matchesSearch && matchesEspecializacao;
        });
    }, [dentistas, search, especializacao]);

    const especializacoes = [...new Set(dentistas.map((dentista) => dentista.especializacao).filter(Boolean))];
    const totalPages = Math.max(1, Math.ceil(filteredDentistas.length / ITEMS_PER_PAGE));
    const paginatedDentistas = filteredDentistas.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, especializacao]);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/dentistas/${dentistaParaExcluir.idDentista}`);
            fetchDentistas();
            setDentistaParaExcluir(null);
            setFeedback({ type: 'success', message: 'Dentista removido com sucesso.' });
        } catch (err) {
            setError("Não foi possível deletar o dentista.");
        }
    };

    return (
        <div className="page-shell">
            <PageHeader
                eyebrow="Equipe clinica"
                title="Gerenciamento de dentistas"
                subtitle="Centralize profissionais, especialidades e dados de contato da equipe odontologica."
                actions={<Button variant="dark" className="rounded-pill px-4" onClick={() => navigate('/dentistas/novo')}>Adicionar dentista</Button>}
            />

            {loading && <div className="loading-shell"><Spinner animation="border" /></div>}
            {feedback && <Alert variant={feedback.type}>{feedback.message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && (
                <ListToolbar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Busque por nome, CRO ou email"
                    filterLabel="Especializacao"
                    filterValue={especializacao}
                    onFilterChange={setEspecializacao}
                    filterOptions={[
                        { value: '', label: 'Todas as especializacoes' },
                        ...especializacoes.map((item) => ({ value: item, label: item }))
                    ]}
                />
            )}

            {!loading && !error && (
                <div className="table-shell">
                <Table hover responsive className="align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CRO</th>
                            <th>Especialização</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedDentistas.map(dentista => (
                            <tr key={dentista.idDentista}>
                                <td>{dentista.nome}</td>
                                <td><Badge bg="light" text="dark">{dentista.cro}</Badge></td>
                                <td>{dentista.especializacao}</td>
                                <td>{dentista.email}</td>
                                <td>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => navigate(`/dentistas/editar/${dentista.idDentista}`)}>Editar</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => setDentistaParaExcluir(dentista)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
            )}
            <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <ConfirmActionModal
                show={!!dentistaParaExcluir}
                title="Excluir dentista"
                body={`Deseja realmente excluir ${dentistaParaExcluir?.nome || 'este dentista'}?`}
                onCancel={() => setDentistaParaExcluir(null)}
                onConfirm={handleDelete}
                confirmLabel="Excluir profissional"
            />
        </div>
    );
};

export default Dentista;
