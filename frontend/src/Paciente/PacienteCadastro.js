import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { aplicarMascaraTelefone, tratarErroBackend } from '../ultilitarios/ultilitarios';

const somenteDigitos = (value) => value.replace(/\D/g, '');

const formatarCpf = (value) => {
    const digits = somenteDigitos(value).slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

const cpfValido = (value) => {
    const digits = somenteDigitos(value);
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    const calc = (base, pesoInicial) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) { soma += Number(base[i]) * (pesoInicial - i); }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };
    const d1 = calc(digits.slice(0, 9), 10);
    const d2 = calc(`${digits.slice(0, 9)}${d1}`, 11);
    return digits === `${digits.slice(0, 9)}${d1}${d2}`;
};

const PacienteCadastro = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [paciente, setPaciente] = useState({ nome: '', dataNascimento: '', endereco: '', telefone: '', email: '', cpf: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/pacientes/${id}`)
                .then(response => {
                    setPaciente({ ...response.data, cpf: formatarCpf(response.data.cpf || ''), telefone: response.data.telefone || '' });
                    setLoading(false);
                })
                .catch(() => { setError('Nao foi possivel carregar os dados do paciente.'); setLoading(false); });
        }
    }, [id]);

    useEffect(() => {
        if (success) { const timer = setTimeout(() => setSuccess(null), 5000); return () => clearTimeout(timer); }
    }, [success]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaciente(prev => ({
            ...prev,
            [name]: name === 'cpf' ? formatarCpf(value) : name === 'telefone' ? aplicarMascaraTelefone(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!cpfValido(paciente.cpf)) { setError('CPF invalido.'); return; }

        setLoading(true);
        try {
            if (paciente.idPaciente) {
                await axios.put(`${API_BASE_URL}/pacientes/${paciente.idPaciente}`, paciente);
                setSuccess('Paciente atualizado com sucesso!');
            } else {
                await axios.post(`${API_BASE_URL}/pacientes`, paciente);
                setSuccess('Paciente cadastrado com sucesso!');
            }
            setTimeout(() => navigate('/pacientes'), 1500);
        } catch (err) {
            setError(tratarErroBackend(err, 'Erro ao salvar paciente.'));
        } finally { setLoading(false); }
    };

    return (
        <Container className="page-shell">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Cadastros</span>
                    <h1 className="section-title">{id ? 'Editar Paciente' : 'Novo Paciente'}</h1>
                    <p className="section-subtitle">Preencha os dados pessoais do paciente para cadastro no sistema.</p>
                </div>
                <Button variant="outline-secondary" className="rounded-pill" onClick={() => navigate('/pacientes')}>Voltar</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card className="surface-card">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-md-8">
                                <Form.Label className="fw-medium small">Nome Completo</Form.Label>
                                <Form.Control type="text" name="nome" value={paciente.nome} onChange={handleChange} required className="toolbar-input" />
                            </div>
                            <div className="col-md-4">
                                <Form.Label className="fw-medium small">CPF</Form.Label>
                                <Form.Control type="text" name="cpf" value={paciente.cpf} onChange={handleChange} placeholder="000.000.000-00" maxLength={14} required className="toolbar-input" />
                            </div>
                            <div className="col-md-4">
                                <Form.Label className="fw-medium small">Data de Nascimento</Form.Label>
                                <Form.Control type="date" name="dataNascimento" value={paciente.dataNascimento} onChange={handleChange} required className="toolbar-input" />
                            </div>
                            <div className="col-md-4">
                                <Form.Label className="fw-medium small">Email</Form.Label>
                                <Form.Control type="email" name="email" value={paciente.email} onChange={handleChange} className="toolbar-input" />
                            </div>
                            <div className="col-md-4">
                                <Form.Label className="fw-medium small">Telefone</Form.Label>
                                <Form.Control type="text" name="telefone" value={paciente.telefone} onChange={handleChange} placeholder="(11) 99999-9999" maxLength={15} required className="toolbar-input" />
                            </div>
                            <div className="col-12">
                                <Form.Label className="fw-medium small">Endereco</Form.Label>
                                <Form.Control type="text" name="endereco" value={paciente.endereco} onChange={handleChange} className="toolbar-input" />
                            </div>
                        </div>

                        <div className="d-flex gap-2 pt-2">
                            <Button variant="dark" type="submit" className="rounded-pill px-4" disabled={loading}>
                                {loading ? 'Salvando...' : 'Salvar Paciente'}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => navigate('/pacientes')} className="rounded-pill px-4">
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PacienteCadastro;