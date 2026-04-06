import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import './CalendarStyles.css';
import { API_BASE_URL } from '../config/api';

const Consultas = () => {
    const navigate = useNavigate();
    const [consultas, setConsultas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        axios.get(`${API_BASE_URL}/consultas`)
            .then(response => {
                setConsultas(response.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const getTileClassName = ({ date, view }) => {
        if (view === 'month') {
            const diaString = date.toISOString().split('T')[0];
            const consultasNoDia = consultas.filter(c => c.dataHora.startsWith(diaString));

            if (consultasNoDia.length === 0) return null;

            const temCancelada = consultasNoDia.some(c => c.status === 'CANCELADA');
            if (temCancelada) return 'dia-cancelada';

            const temFinalizada = consultasNoDia.some(c => c.status === 'FINALIZADA');
            if (temFinalizada) return 'dia-finalizada';

            const temAgendada = consultasNoDia.some(c => c.status === 'AGENDADA');
            if (temAgendada) return 'dia-agendada';
        }
        return null;
    };

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Calendário de Consultas</h2>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Calendar
                                tileClassName={getTileClassName}
                                className="w-100 border-0"
                                value={selectedDate}
                                onChange={setSelectedDate}
                            />
                        </Card.Body>
                        <Card.Footer>
                            <Row className="align-items-center">
                                <Col xs={12} md={7} className="d-flex align-items-center justify-content-center justify-content-md-start mb-2 mb-md-0 flex-wrap gap-3">
                                    <div className="d-flex align-items-center"><span className="legend-dot legend-dot--agendada"></span>Agendada</div>
                                    <div className="d-flex align-items-center"><span className="legend-dot legend-dot--finalizada"></span>Finalizada</div>
                                    <div className="d-flex align-items-center"><span className="legend-dot legend-dot--cancelada"></span>Cancelada</div>
                                </Col>
                                <Col xs={12} md={5} className="text-center text-md-end">
                                    <Button variant="primary" onClick={() => navigate('/consultas/hoje')}>
                                        Agendamentos de Hoje
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Consultas;
