import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

const Paciente = () => {
    const navigate = useNavigate();

    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPacientes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/pacientes`);
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/pacientes/${id}`);
            fetchPacientes();
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
        <div className="container mt-5">
            <h2>Gerenciamento de Pacientes</h2>
            <Button variant="primary" className="mb-3" onClick={handleAddPaciente}>Adicionar Paciente</Button>

            {loading && (
                <div className="text-center">
                    <Spinner animation="border" role="status" />
                    <p>Carregando pacientes...</p>
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && pacientes.length === 0 && (
                <Alert variant="info">Nenhum paciente encontrado.</Alert>
            )}

            {!loading && !error && pacientes.length > 0 && (
                <Table striped bordered hover>
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
                        {pacientes.map(paciente => (
                            <tr key={paciente.idPaciente}>
                                <td>{paciente.nome}</td>
                                <td>{paciente.cpf}</td>
                                <td>{paciente.email}</td>
                                <td>{paciente.telefone}</td>
                                <td>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => handleEditPaciente(paciente.idPaciente)}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(paciente.idPaciente)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default Paciente;
