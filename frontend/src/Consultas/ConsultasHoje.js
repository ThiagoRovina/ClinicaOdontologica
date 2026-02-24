import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { API_BASE_URL } from '../config/api';

const ConsultasHoje = () => {
    const navigate = useNavigate();
    const [consultasHoje, setConsultasHoje] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Chama o novo endpoint específico para as consultas de hoje
        axios.get(`${API_BASE_URL}/consultas/hoje`)
            .then(response => {
                setConsultasHoje(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao buscar consultas de hoje", err);
                setError("Não foi possível carregar as consultas de hoje.");
                setLoading(false);
            });
    }, []);

    const handleFinalizar = async (id) => {
        try {
            await axios.patch(`${API_BASE_URL}/consultas/${id}/finalizar`);
            setConsultasHoje(prev => prev.filter(c => c.idConsulta !== id));
        } catch (err) {
            setError("Erro ao finalizar consulta.");
        }
    };

    const handleCancelar = async (id) => {
        try {
            await axios.patch(`${API_BASE_URL}/consultas/${id}/cancelar`);
            setConsultasHoje(prev => prev.filter(c => c.idConsulta !== id));
        } catch (err) {
            setError("Erro ao cancelar consulta.");
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Agendamentos de Hoje</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Horário</th>
                            <th>Paciente</th>
                            <th>Dentista</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultasHoje.length > 0 ? consultasHoje.map(c => (
                            <tr key={c.idConsulta}>
                                <td>{new Date(c.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                                <td>{c.paciente.nome}</td>
                                <td>{c.dentista.nome}</td>
                                <td>
                                    <Button variant="success" size="sm" className="me-2" onClick={() => handleFinalizar(c.idConsulta)}>Finalizar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleCancelar(c.idConsulta)}>Cancelar</Button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center">Nenhum agendamento para hoje.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
            <div className="mt-4 text-center">
                <Button variant="secondary" onClick={() => navigate('/consultas')}>Voltar ao Calendário</Button>
            </div>
        </Container>
    );
};

export default ConsultasHoje;
