import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { API_BASE_URL } from '../config/api';
import { ConfirmarExclusao, tratarErroBackend } from '../ultilitarios/ultilitarios';

const ConsultasHoje = () => {
    const navigate = useNavigate();
    const [consultasHoje, setConsultasHoje] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null); // { id, tipo: 'finalizar'|'cancelar', loading }

    useEffect(() => {
        axios.get(`${API_BASE_URL}/consultas/hoje`)
            .then(response => {
                setConsultasHoje(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Não foi possível carregar as consultas de hoje.");
                setLoading(false);
            });
    }, []);

    // Auto-dismiss alertas
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 8000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const iniciarAcao = (id, tipo) => {
        setConfirmAction({ id, tipo, loading: false });
    };

    const confirmarAcao = async () => {
        if (!confirmAction) return;
        setConfirmAction(prev => ({ ...prev, loading: true }));
        try {
            if (confirmAction.tipo === 'finalizar') {
                await axios.patch(`${API_BASE_URL}/consultas/${confirmAction.id}/finalizar`);
                setSuccess('Consulta finalizada com sucesso.');
            } else {
                await axios.patch(`${API_BASE_URL}/consultas/${confirmAction.id}/cancelar`);
                setSuccess('Consulta cancelada com sucesso.');
            }
            setConsultasHoje(prev => prev.filter(c => c.idConsulta !== confirmAction.id));
        } catch (err) {
            setError(tratarErroBackend(err, `Erro ao ${confirmAction.tipo === 'finalizar' ? 'finalizar' : 'cancelar'} consulta.`));
        } finally {
            setConfirmAction(null);
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Agendamentos de Hoje</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

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
                                    <div className="d-flex gap-2">
                                        <Button variant="success" size="sm" onClick={() => iniciarAcao(c.idConsulta, 'finalizar')}>Finalizar</Button>
                                        <Button variant="danger" size="sm" onClick={() => iniciarAcao(c.idConsulta, 'cancelar')}>Cancelar</Button>
                                    </div>
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

            <ConfirmarExclusao
                show={!!confirmAction}
                titulo={confirmAction?.tipo === 'finalizar' ? 'Finalizar Consulta' : 'Cancelar Consulta'}
                mensagem={confirmAction?.tipo === 'finalizar'
                    ? 'Deseja finalizar esta consulta como concluída?'
                    : 'Tem certeza que deseja cancelar esta consulta?'}
                onConfirm={confirmarAcao}
                onCancel={() => setConfirmAction(null)}
                loading={confirmAction?.loading || false}
            />
        </Container>
    );
};

export default ConsultasHoje;
