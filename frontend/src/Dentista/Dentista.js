import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, tratarErroBackend } from '../ultilitarios/ultilitarios';

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
        } catch (err) {
            setError("Não foi possível carregar os dentistas.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDentistas();
    }, [fetchDentistas]);

    const confirmarExclusao = async () => {
        if (!excluirId) return;
        setExcluindo(true);
        try {
            await axios.delete(`${API_BASE_URL}/dentistas/${excluirId}`);
            await fetchDentistas();
        } catch (err) {
            setError(tratarErroBackend(err, "Não foi possível deletar o dentista."));
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
        <div className="container mt-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h2>Gerenciamento de Dentistas</h2>
                <div className="d-flex gap-2">
                    <InputGroup style={{ maxWidth: 280 }}>
                        <Form.Control
                            placeholder="Buscar por nome, CRO ou especialização"
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                        />
                    </InputGroup>
                    <Button variant="primary" onClick={() => navigate('/funcionarios/novo')}>Novo Dentista</Button>
                </div>
            </div>

            {loading && <div className="text-center"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && dentistasFiltrados.length === 0 && (
                <Alert variant="info">
                    {busca ? 'Nenhum dentista encontrado para a busca.' : 'Nenhum dentista cadastrado.'}
                </Alert>
            )}

            {!loading && !error && dentistasFiltrados.length > 0 && (
                <Table striped bordered hover responsive>
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
                        {dentistasFiltrados.map(dentista => (
                            <tr key={dentista.idDentista}>
                                <td>{dentista.nome}</td>
                                <td>{dentista.cro}</td>
                                <td>{dentista.especializacao}</td>
                                <td>{dentista.email}</td>
                                <td>
                                    <Button variant="outline-info" size="sm" className="me-1" onClick={() => navigate(`/dentistas/editar/${dentista.idDentista}`)}>Editar</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => setExcluirId(dentista.idDentista)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <ConfirmarExclusao
                show={!!excluirId}
                titulo="Excluir Dentista"
                mensagem="Tem certeza que deseja excluir este dentista? Esta ação não pode ser desfeita."
                onConfirm={confirmarExclusao}
                onCancel={() => setExcluirId(null)}
                loading={excluindo}
            />
        </div>
    );
};

export default Dentista;