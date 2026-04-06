import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../api';
import PageHeader from '../components/PageHeader';

function ProcedimentoCadastro() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [procedimento, setProcedimento] = useState({ nome: '', descricao: '', valor: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        api.get(`/api/procedimentos/${id}`)
            .then((response) => setProcedimento(response.data))
            .catch(() => setError('Nao foi possivel carregar o procedimento.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProcedimento((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (id) {
                await api.put(`/api/procedimentos/${id}`, procedimento);
                setSuccess('Procedimento atualizado com sucesso.');
            } else {
                await api.post('/api/procedimentos', procedimento);
                setSuccess('Procedimento cadastrado com sucesso.');
            }
            setTimeout(() => navigate('/procedimentos'), 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Nao foi possivel salvar o procedimento.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="page-shell">
            <PageHeader
                eyebrow="Cadastro financeiro"
                title={id ? 'Editar procedimento' : 'Novo procedimento'}
                subtitle="Cadastre servicos com nome, descricao e valor para organizar o prontuario e estimar faturamento."
            />

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card className="surface-card">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control name="nome" value={procedimento.nome} onChange={handleChange} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Valor</Form.Label>
                                <Form.Control type="number" min="0.01" step="0.01" name="valor" value={procedimento.valor} onChange={handleChange} required />
                            </Col>
                            <Col md={12}>
                                <Form.Label>Descricao</Form.Label>
                                <Form.Control as="textarea" rows={4} name="descricao" value={procedimento.descricao || ''} onChange={handleChange} />
                            </Col>
                        </Row>
                        <div className="mt-4 d-flex gap-2">
                            <Button variant="dark" type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar procedimento'}</Button>
                            <Button variant="outline-secondary" onClick={() => navigate('/procedimentos')}>Cancelar</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ProcedimentoCadastro;
