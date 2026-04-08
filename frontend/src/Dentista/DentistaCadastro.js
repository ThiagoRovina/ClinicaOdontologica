import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const DentistaCadastro = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [dentista, setDentista] = useState({ nome: '', especializacao: '', cro: '', email: '', telefone: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/dentistas/${id}`)
                .then(response => { setDentista(response.data); setLoading(false); })
                .catch(() => { setError('Nao foi possivel carregar os dados do dentista.'); setLoading(false); });
        }
    }, [id]);

    useEffect(() => { if (success) { const t = setTimeout(() => setSuccess(null), 5000); return () => clearTimeout(t); } }, [success]);

    const handleChange = (e) => { setDentista(prev => ({ ...prev, [e.target.name]: e.target.value })); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (dentista.idDentista) {
                await axios.put(`${API_BASE_URL}/dentistas/${dentista.idDentista}`, dentista);
                setSuccess('Dentista atualizado com sucesso!');
            } else {
                await axios.post(`${API_BASE_URL}/dentistas`, dentista);
                setSuccess('Dentista cadastrado com sucesso!');
            }
            setTimeout(() => navigate('/dentistas'), 1500);
        } catch { setError('Erro ao salvar dentista.'); }
        finally { setLoading(false); }
    };

    return (
        <Container className="page-shell">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Corpo clinico</span>
                    <h1 className="section-title">{id ? 'Editar Dentista' : 'Novo Dentista'}</h1>
                    <p className="section-subtitle">Cadastre os dados profissionais e de contato do dentista.</p>
                </div>
                <Button variant="outline-secondary" className="rounded-pill" onClick={() => navigate('/dentistas')}>Voltar</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card className="surface-card">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-md-7">
                                <Form.Label className="fw-medium small">Nome Completo</Form.Label>
                                <Form.Control type="text" name="nome" value={dentista.nome} onChange={handleChange} required className="toolbar-input" />
                            </div>
                            <div className="col-md-5">
                                <Form.Label className="fw-medium small">CRO</Form.Label>
                                <Form.Control type="text" name="cro" value={dentista.cro} onChange={handleChange} required className="toolbar-input" />
                            </div>
                            <div className="col-md-6">
                                <Form.Label className="fw-medium small">Especializacao</Form.Label>
                                <Form.Control type="text" name="especializacao" value={dentista.especializacao} onChange={handleChange} required className="toolbar-input" />
                            </div>
                            <div className="col-md-6">
                                <Form.Label className="fw-medium small">Email</Form.Label>
                                <Form.Control type="email" name="email" value={dentista.email} onChange={handleChange} className="toolbar-input" />
                            </div>
                            <div className="col-md-6">
                                <Form.Label className="fw-medium small">Telefone</Form.Label>
                                <Form.Control type="text" name="telefone" value={dentista.telefone} onChange={handleChange} className="toolbar-input" />
                            </div>
                        </div>

                        <div className="d-flex gap-2 pt-2">
                            <Button variant="dark" type="submit" className="rounded-pill px-4" disabled={loading}>
                                {loading ? 'Salvando...' : 'Salvar Dentista'}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => navigate('/dentistas')} className="rounded-pill px-4">
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DentistaCadastro;