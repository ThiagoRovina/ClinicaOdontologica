import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, tratarErroBackend } from '../ultilitarios/ultilitarios';

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
            setError("Não foi possível carregar os pacientes.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPacientes();
    }, [fetchPacientes]);

    const iniciarExclusao = (id) => {
        setExcluirId(id);
    };

    const confirmarExclusao = async () => {
        if (!excluirId) return;
        setExcluindo(true);
        try {
            await axios.delete(`${API_BASE_URL}/pacientes/${excluirId}`);
            await fetchPacientes();
        } catch (err) {
            setError(tratarErroBackend(err, "Não foi possível deletar o paciente."));
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
        <div className="container mt-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h2>Gerenciamento de Pacientes</h2>
                <div className="d-flex gap-2">
                    <InputGroup style={{ maxWidth: 280 }}>
                        <Form.Control
                            placeholder="Buscar por nome, CPF ou email"
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                        />
                    </InputGroup>
                    <Button variant="primary" onClick={() => navigate('/pacientes/novo')}>Adicionar Paciente</Button>
                </div>
            </div>

            {loading && (
                <div className="text-center">
                    <Spinner animation="border" role="status" />
                    <p>Carregando pacientes...</p>
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && pacientesFiltrados.length === 0 && (
                <Alert variant="info">
                    {busca ? 'Nenhum paciente encontrado para a busca.' : 'Nenhum paciente encontrado.'}
                </Alert>
            )}

            {!loading && !error && pacientesFiltrados.length > 0 && (
                <Table striped bordered hover responsive>
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
                        {pacientesFiltrados.map(paciente => (
                            <tr key={paciente.idPaciente}>
                                <td>{paciente.nome}</td>
                                <td>{paciente.cpf}</td>
                                <td>{paciente.email}</td>
                                <td>{paciente.telefone}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" className="me-1" onClick={() => navigate(`/pacientes/${paciente.idPaciente}/prontuario`)}>Prontuário</Button>
                                    <Button variant="outline-info" size="sm" className="me-1" onClick={() => navigate(`/pacientes/editar/${paciente.idPaciente}`)}>Editar</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => iniciarExclusao(paciente.idPaciente)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <ConfirmarExclusao
                show={!!excluirId}
                titulo="Excluir Paciente"
                mensagem="Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita."
                onConfirm={confirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </div>
    );
};

export default Paciente;