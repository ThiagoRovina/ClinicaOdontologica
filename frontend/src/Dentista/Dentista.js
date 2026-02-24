import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const Dentista = () => {
    const navigate = useNavigate();
    const [dentistas, setDentistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/dentistas/${id}`);
            fetchDentistas();
        } catch (err) {
            setError("Não foi possível deletar o dentista.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Gerenciamento de Dentistas</h2>
            <Button variant="primary" className="mb-3" onClick={() => navigate('/dentistas/novo')}>Adicionar Dentista</Button>

            {loading && <div className="text-center"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <Table striped bordered hover>
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
                        {dentistas.map(dentista => (
                            <tr key={dentista.idDentista}>
                                <td>{dentista.nome}</td>
                                <td>{dentista.cro}</td>
                                <td>{dentista.especializacao}</td>
                                <td>{dentista.email}</td>
                                <td>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => navigate(`/dentistas/editar/${dentista.idDentista}`)}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(dentista.idDentista)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default Dentista;
