import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, tratarErroBackend } from '../ultilitarios/ultilitarios';

const Funcionario = () => {
    const navigate = useNavigate();

    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busca, setBusca] = useState('');
    const [excluirId, setExcluirId] = useState(null);
    const [excluindo, setExcluindo] = useState(false);

    const fetchFuncionarios = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/funcionarios`);
            setFuncionarios(response.data);
            setError(null);
        } catch (err) {
            setError("Não foi possível carregar os funcionários. Verifique se o backend está rodando e tente novamente.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFuncionarios();
    }, [fetchFuncionarios]);

    const confirmarExclusao = async () => {
        if (!excluirId) return;
        setExcluindo(true);
        try {
            await axios.delete(`${API_BASE_URL}/funcionarios/${excluirId}`);
            await fetchFuncionarios();
        } catch (err) {
            setError(tratarErroBackend(err, "Não foi possível deletar o funcionário."));
        } finally {
            setExcluindo(false);
            setExcluirId(null);
        }
    };

    const funcionariosFiltrados = useMemo(() => {
        if (!busca.trim()) return funcionarios;
        const termo = busca.toLowerCase();
        return funcionarios.filter(f =>
            f.nmFuncionario?.toLowerCase().includes(termo) ||
            f.nuMatricula?.toString().includes(termo) ||
            f.cargo?.toLowerCase().includes(termo) ||
            f.email?.toLowerCase().includes(termo)
        );
    }, [funcionarios, busca]);

    return (
        <div className="container mt-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h2>Gerenciamento de Funcionários</h2>
                <div className="d-flex gap-2">
                    <InputGroup style={{ maxWidth: 280 }}>
                        <Form.Control
                            placeholder="Buscar por nome, matrícula ou cargo"
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                        />
                    </InputGroup>
                    <Button variant="primary" onClick={() => navigate('/funcionarios/novo')}>Adicionar Funcionário</Button>
                </div>
            </div>

            {loading && (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                    <p>Carregando funcionários...</p>
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && funcionariosFiltrados.length === 0 && (
                <Alert variant="info">
                    {busca ? 'Nenhum funcionário encontrado para a busca.' : 'Nenhum funcionário encontrado.'}
                </Alert>
            )}

            {!loading && !error && funcionariosFiltrados.length > 0 && (
                <Table striped bordered hover responsive>
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
                        {funcionariosFiltrados.map(funcionario => (
                            <tr key={funcionario.idFuncionario}>
                                <td>{funcionario.nmFuncionario}</td>
                                <td>{funcionario.nuMatricula}</td>
                                <td>{funcionario.cargo}</td>
                                <td>{funcionario.email}</td>
                                <td>
                                    <Button variant="outline-info" size="sm" className="me-1" onClick={() => navigate(`/funcionarios/editar/${funcionario.idFuncionario}`)}>Editar</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => setExcluirId(funcionario.idFuncionario)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <ConfirmarExclusao
                show={!!excluirId}
                titulo="Excluir Funcionário"
                mensagem="Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita."
                onConfirm={confirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </div>
    );
};

export default Funcionario;