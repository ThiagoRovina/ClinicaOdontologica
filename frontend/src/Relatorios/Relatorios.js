import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';

import api from '../api';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';

const getDefaultDateRange = () => {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);
    const start = startDate.toISOString().slice(0, 10);
    return { start, end };
};

function Relatorios() {
    const [{ start, end }, setRange] = useState(getDefaultDateRange());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);

    const fetchResumo = useCallback(async (dateStart = start, dateEnd = end) => {
        try {
            setLoading(true);
            const response = await api.get('/api/relatorios/resumo', {
                params: { dataInicio: dateStart, dataFim: dateEnd }
            });
            setSummary(response.data);
            setError(null);
        } catch (err) {
            setError('Nao foi possivel carregar o relatorio.');
        } finally {
            setLoading(false);
        }
    }, [start, end]);

    useEffect(() => {
        fetchResumo();
    }, [fetchResumo]);

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchResumo(start, end);
    };

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Relatorios"
                title="Resumo operacional e financeiro"
                subtitle="Acompanhe consultas, procedimentos realizados e faturamento estimado por periodo."
            />

            <Card className="surface-card mb-4">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3 align-items-end">
                            <Col md={4}>
                                <Form.Label>Data inicial</Form.Label>
                                <Form.Control type="date" value={start} onChange={(event) => setRange((prev) => ({ ...prev, start: event.target.value }))} />
                            </Col>
                            <Col md={4}>
                                <Form.Label>Data final</Form.Label>
                                <Form.Control type="date" value={end} onChange={(event) => setRange((prev) => ({ ...prev, end: event.target.value }))} />
                            </Col>
                            <Col md={4}>
                                <Button type="submit" variant="dark" className="w-100">Atualizar relatorio</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {loading ? (
                <div className="loading-shell"><Spinner animation="border" /></div>
            ) : (
                <>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {summary && (
                        <Row className="g-4">
                            <Col lg={4} md={6}><StatsCard label="Consultas no periodo" value={summary.totalConsultas} helper={`${summary.dataInicio} ate ${summary.dataFim}`} accent="navy" /></Col>
                            <Col lg={4} md={6}><StatsCard label="Consultas agendadas" value={summary.consultasAgendadas} helper="ainda em aberto" accent="blue" /></Col>
                            <Col lg={4} md={6}><StatsCard label="Consultas canceladas" value={summary.consultasCanceladas} helper="acompanhe perdas" accent="rose" /></Col>
                            <Col lg={6} md={6}><StatsCard label="Procedimentos realizados" value={summary.procedimentosRealizados} helper="registros no prontuario" accent="green" /></Col>
                            <Col lg={6} md={6}><StatsCard label="Faturamento estimado" value={`R$ ${Number(summary.faturamentoEstimado || 0).toFixed(2)}`} helper="somatorio dos procedimentos realizados" accent="sand" /></Col>
                        </Row>
                    )}
                </>
            )}
        </Container>
    );
}

export default Relatorios;
