import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const DentistaCadastro = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [dentista, setDentista] = useState({
        nome: '',
        especializacao: '',
        cro: '',
        email: '',
        telefone: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/dentistas/${id}`)
                .then(response => {
                    setDentista(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError("Não foi possível carregar os dados do dentista.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDentista(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (dentista.idDentista) {
                await axios.put(`${API_BASE_URL}/dentistas/${dentista.idDentista}`, dentista);
                setSuccess("Dentista atualizado com sucesso!");
            } else {
                await axios.post(`${API_BASE_URL}/dentistas`, dentista);
                setSuccess("Dentista cadastrado com sucesso!");
            }
            setTimeout(() => navigate('/dentistas'), 1500);
        } catch (err) {
            setError("Erro ao salvar dentista.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h2>{id ? "Editar Dentista" : "Adicionar Dentista"}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control type="text" name="nome" value={dentista.nome} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>CRO</Form.Label>
                    <Form.Control type="text" name="cro" value={dentista.cro} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Especialização</Form.Label>
                    <Form.Control type="text" name="especializacao" value={dentista.especializacao} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={dentista.email} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control type="text" name="telefone" value={dentista.telefone} onChange={handleChange} />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dentistas')} className="ms-2">
                    Cancelar
                </Button>
            </Form>
        </Container>
    );
};

export default DentistaCadastro;
