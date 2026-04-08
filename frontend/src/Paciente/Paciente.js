import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Alert, Button, Container, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, tratarErroBackend } from '../ultilitarios/ultilitarios';
import PageHeader from '../components/PageHeader';
import ListToolbar from '../components/ListToolbar';

const IconProntuario = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94L6.73 20.4a1 1 0 01-1.73 0 1 1 0 010-1.73l6.93-6.93A6 6 0 0114.7 6.3z"/>
    </svg>
);
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

const Paciente = () => {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busca, setBusca] = useState('');
    const [excluirId, setExcluirId] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const fetchPacientes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/pacientes`);
            setPacientes(response.data);
            setError(null);
        } catch (err) {
            setError('Nao foi possivel carregar os pacientes.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPacientes(); }, [fetchPacientes]);

    const confirmarExclusao = async () => {
        if (!excluirId) return;
        setExcluindo(true);
        try {
            await axios.delete(`${API_BASE_URL}/pacientes/${excluirId}`);
            await fetchPacientes();
        } catch (err) {
            setError(tratarErroBackend(err, 'Nao foi possivel deletar o paciente.'));
        } finally {
            setExcluindo(false);
            setExcluirId(null);
        }
    };

    const pacientesFiltrados = useMemo(() => {
        if (!busca.trim()) return pacientes;
        const termo = busca.toLowerCase();
        return pacientes.filter(p =>
            p.nome?.toLowerCase().includes(termo) ||
            p.cpf?.includes(termo) ||
            p.email?.toLowerCase().includes(termo)
        );
    }, [pacientes, busca]);

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Cadastros"
                title="Pacientes"
                subtitle="Gerencie as informacoes de contato e dados pessoais dos pacientes da clinica."
                actions={
                    <Button variant="dark" className="rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => navigate('/pacientes/novo')}>
                        <IconPlus /> Novo Paciente
                    </Button>
                }
            />

            {error && <Alert variant="danger">{error}</Alert>}

            <ListToolbar
                searchValue={busca}
                onSearchChange={setBusca}
                searchPlaceholder="Buscar por nome, CPF ou email"
            />

            {loading ? (
                <div className="loading-shell d-flex flex-column align-items-center justify-content-center">
                    <Spinner animation="border" />
                    <p className="text-muted mt-3 mb-0 small">Carregando pacientes...</p>
                </div>
            ) : pacientesFiltrados.length === 0 ? (
                <Alert variant="info">
                    {busca ? 'Nenhum paciente encontrado para a busca.' : 'Nenhum paciente cadastrado.'}
                </Alert>
            ) : (
                <div className="table-shell">
                    <Table hover responsive className="mb-0">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th style={{ width: 260 }}>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pacientesFiltrados.map(paciente => (
                                <tr key={paciente.idPaciente}>
                                    <td className="fw-medium">{paciente.nome}</td>
                                    <td className="text-muted">{paciente.cpf}</td>
                                    <td>{paciente.email}</td>
                                    <td>{paciente.telefone}</td>
                                    <td>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <Button variant="outline-dark" size="sm" className="rounded-pill d-inline-flex align-items-center gap-1" onClick={() => navigate(`/pacientes/${paciente.idPaciente}/prontuario`)}>
                                                <IconProntuario /> Prontuario
                                            </Button>
                                            <Button variant="outline-primary" size="sm" className="rounded-pill d-inline-flex align-items-center gap-1" onClick={() => navigate(`/pacientes/editar/${paciente.idPaciente}`)}>
                                                <IconEdit /> Editar
                                            </Button>
                                            <Button variant="outline-danger" size="sm" className="rounded-pill d-inline-flex align-items-center gap-1" onClick={() => setExcluirId(paciente.idPaciente)}>
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
                titulo="Excluir Paciente"
                mensagem="Tem certeza que deseja excluir este paciente? Esta acao nao pode ser desfeita."
                onConfirm={confirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </Container>
    );
};

export default Paciente;