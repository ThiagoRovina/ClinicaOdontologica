import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ConfirmActionModal from '../components/ConfirmActionModal';
import ListToolbar from '../components/ListToolbar';
import PageHeader from '../components/PageHeader';
import PaginationBar from '../components/PaginationBar';

const ITEMS_PER_PAGE = 5;

const Paciente = () => {
    const navigate = useNavigate();

    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pacienteParaExcluir, setPacienteParaExcluir] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const fetchPacientes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/pacientes');
            setPacientes(response.data);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar pacientes:", err);
            setError("Não foi possível carregar os pacientes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPacientes();
    }, [fetchPacientes]);

    const filteredPacientes = useMemo(() => {
        const term = search.toLowerCase();
        return pacientes.filter((paciente) =>
            [paciente.nome, paciente.cpf, paciente.email, paciente.telefone]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(term))
        );
    }, [pacientes, search]);

    const totalPages = Math.max(1, Math.ceil(filteredPacientes.length / ITEMS_PER_PAGE));
    const paginatedPacientes = filteredPacientes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/pacientes/${pacienteParaExcluir.idPaciente}`);
            fetchPacientes();
            setPacienteParaExcluir(null);
            setFeedback({ type: 'success', message: 'Paciente removido com sucesso.' });
        } catch (err) {
            console.error("Erro ao deletar paciente:", err);
            setError("Não foi possível deletar o paciente.");
        }
    };

    const handleAddPaciente = () => {
        navigate('/pacientes/novo');
    };

    const handleEditPaciente = (id) => {
        navigate(`/pacientes/editar/${id}`);
    };

    return (
        <div className="page-shell">
            <PageHeader
                eyebrow="Cadastro"
                title="Gerenciamento de pacientes"
                subtitle="Consulte a base, encontre rapidamente um cadastro e mantenha os dados sempre atualizados."
                actions={<Button variant="dark" className="rounded-pill px-4" onClick={handleAddPaciente}>Adicionar paciente</Button>}
            />

            {loading && (
                <div className="loading-shell">
                    <Spinner animation="border" role="status" />
                </div>
            )}

            {feedback && <Alert variant={feedback.type}>{feedback.message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && (
                <ListToolbar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Busque por nome, CPF, email ou telefone"
                />
            )}

            {!loading && !error && filteredPacientes.length === 0 && (
                <Alert variant="info">Nenhum paciente encontrado.</Alert>
            )}

            {!loading && !error && filteredPacientes.length > 0 && (
                <div className="table-shell">
                <Table hover responsive className="align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPacientes.map(paciente => (
                            <tr key={paciente.idPaciente}>
                                <td>{paciente.nome}</td>
                                <td><Badge bg="light" text="dark">{paciente.cpf}</Badge></td>
                                <td>{paciente.email}</td>
                                <td>{paciente.telefone}</td>
                                <td>
                                    <Button variant="dark" size="sm" className="me-2" onClick={() => navigate(`/pacientes/${paciente.idPaciente}/prontuario`)}>Prontuario</Button>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => handleEditPaciente(paciente.idPaciente)}>Editar</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => setPacienteParaExcluir(paciente)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
            )}
            <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <ConfirmActionModal
                show={!!pacienteParaExcluir}
                title="Excluir paciente"
                body={`Deseja realmente excluir ${pacienteParaExcluir?.nome || 'este paciente'}?`}
                onCancel={() => setPacienteParaExcluir(null)}
                onConfirm={handleDelete}
                confirmLabel="Excluir cadastro"
            />
        </div>
    );
};

export default Paciente;
