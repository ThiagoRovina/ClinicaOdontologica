import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../api';
import PageHeader from '../components/PageHeader';

const ConsultasHoje = () => {
    const navigate = useNavigate();
    const [consultasHoje, setConsultasHoje] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Chama o novo endpoint específico para as consultas de hoje
        api.get('/api/consultas/hoje')
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
            await api.patch(`/api/consultas/${id}/finalizar`);
            setConsultasHoje(prev => prev.filter(c => c.idConsulta !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao finalizar consulta.");
        }
    };

    const handleCancelar = async (id) => {
        try {
            await api.patch(`/api/consultas/${id}/cancelar`);
            setConsultasHoje(prev => prev.filter(c => c.idConsulta !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao cancelar consulta.");
        }
    };

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Operacao diaria"
                title="Agendamentos de hoje"
                subtitle="Finalize ou cancele atendimentos rapidamente conforme o fluxo do dia."
                actions={<Button variant="outline-dark" onClick={() => navigate('/consultas')}>Voltar ao calendario</Button>}
            />
            
            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <div className="table-shell">
                <Table hover responsive className="align-middle mb-0">
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
                </div>
            )}
        </Container>
    );
};

export default ConsultasHoje;
