import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import api from '../api';
import ConfirmActionModal from '../components/ConfirmActionModal';
import ListToolbar from '../components/ListToolbar';
import PageHeader from '../components/PageHeader';
import PaginationBar from '../components/PaginationBar';

const ITEMS_PER_PAGE = 5;

const Funcionario = () => {
    const navigate = useNavigate(); // Hook para navegação

    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [cargo, setCargo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const fetchFuncionarios = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/funcionarios');
            setFuncionarios(response.data);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar funcionários:", err);
            setError("Não foi possível carregar os funcionários. Verifique se o backend está rodando e tente novamente.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFuncionarios();
    }, [fetchFuncionarios]);

    const filteredFuncionarios = useMemo(() => {
        return funcionarios.filter((funcionario) => {
            const matchesSearch = [funcionario.nmFuncionario, funcionario.email, String(funcionario.nuMatricula)]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(search.toLowerCase()));
            const matchesCargo = !cargo || funcionario.cargo === cargo;
            return matchesSearch && matchesCargo;
        });
    }, [funcionarios, search, cargo]);

    const cargos = [...new Set(funcionarios.map((funcionario) => funcionario.cargo).filter(Boolean))];
    const totalPages = Math.max(1, Math.ceil(filteredFuncionarios.length / ITEMS_PER_PAGE));
    const paginatedFuncionarios = filteredFuncionarios.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, cargo]);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/funcionarios/${funcionarioParaExcluir.idFuncionario}`);
            fetchFuncionarios(); // Recarrega a lista após a exclusão
            setFuncionarioParaExcluir(null);
            setFeedback({ type: 'success', message: 'Funcionario removido com sucesso.' });
        } catch (err) {
            console.error("Erro ao deletar funcionário:", err);
            setError("Não foi possível deletar o funcionário. Tente novamente.");
        }
    };

    const handleAddFuncionario = () => {
        navigate('/funcionarios/novo');
    };

    const handleEditFuncionario = (id) => {
        navigate(`/funcionarios/editar/${id}`);
    };

    return (
        <div className="page-shell">
            <PageHeader
                eyebrow="Gestao interna"
                title="Gerenciamento de funcionarios"
                subtitle="Organize acessos, cargos e informacoes da equipe administrativa e operacional."
                actions={<Button variant="dark" className="rounded-pill px-4" onClick={handleAddFuncionario}>Adicionar funcionario</Button>}
            />

            {loading && (
                <div className="loading-shell">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                </div>
            )}

            {feedback && <Alert variant={feedback.type}>{feedback.message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && (
                <ListToolbar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Busque por nome, email ou matricula"
                    filterLabel="Cargo"
                    filterValue={cargo}
                    onFilterChange={setCargo}
                    filterOptions={[
                        { value: '', label: 'Todos os cargos' },
                        ...cargos.map((item) => ({ value: item, label: item }))
                    ]}
                />
            )}

            {!loading && !error && filteredFuncionarios.length === 0 && (
                <Alert variant="info">Nenhum funcionário encontrado.</Alert>
            )}

            {!loading && !error && filteredFuncionarios.length > 0 && (
                <div className="table-shell">
                <Table hover responsive className="align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Matrícula</th>
                            <th>Cargo</th>
                            <th>Email</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedFuncionarios.map(funcionario => (
                            <tr key={funcionario.idFuncionario}>
                                <td>{funcionario.nmFuncionario}</td>
                                <td><Badge bg="light" text="dark">{funcionario.nuMatricula}</Badge></td>
                                <td>{funcionario.cargo}</td>
                                <td>{funcionario.email}</td>
                                <td>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => handleEditFuncionario(funcionario.idFuncionario)}>Editar</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => setFuncionarioParaExcluir(funcionario)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
            )}
            <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <ConfirmActionModal
                show={!!funcionarioParaExcluir}
                title="Excluir funcionario"
                body={`Deseja realmente excluir ${funcionarioParaExcluir?.nmFuncionario || 'este funcionario'}?`}
                onCancel={() => setFuncionarioParaExcluir(null)}
                onConfirm={handleDelete}
                confirmLabel="Excluir funcionario"
            />
        </div>
    );
};

export default Funcionario;
