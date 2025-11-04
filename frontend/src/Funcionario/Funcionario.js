import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

const Funcionario = () => {
    const navigate = useNavigate();

    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFuncionarios = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/funcionarios`);
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/funcionarios/${id}`);
            fetchFuncionarios();
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
        <div className="container mt-5">
            <h2>Gerenciamento de Funcionários</h2>
            <Button variant="primary" className="mb-3" onClick={handleAddFuncionario}>Adicionar Funcionário</Button>

            {loading && (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                    <p>Carregando funcionários...</p>
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && funcionarios.length === 0 && (
                <Alert variant="info">Nenhum funcionário encontrado.</Alert>
            )}

            {!loading && !error && funcionarios.length > 0 && (
                <Table striped bordered hover>
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
                        {funcionarios.map(funcionario => (
                            <tr key={funcionario.idFuncionario}>
                                <td>{funcionario.nmFuncionario}</td>
                                <td>{funcionario.nuMatricula}</td>
                                <td>{funcionario.cargo}</td>
                                <td>{funcionario.email}</td>
                                <td>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => handleEditFuncionario(funcionario.idFuncionario)}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(funcionario.idFuncionario)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default Funcionario;
