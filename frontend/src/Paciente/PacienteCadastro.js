import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

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
        for (let i = 0; i < base.length; i++) {
            soma += Number(base[i]) * (pesoInicial - i);
        }
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

    const [paciente, setPaciente] = useState({
        nome: '',
        dataNascimento: '',
        endereco: '',
        telefone: '',
        email: '',
        cpf: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/pacientes/${id}`)
                .then(response => {
                    setPaciente({ ...response.data, cpf: formatarCpf(response.data.cpf || '') });
                    setLoading(false);
                })
                .catch(err => {
                    setError("Não foi possível carregar os dados do paciente.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaciente(prev => ({
            ...prev,
            [name]: name === 'cpf' ? formatarCpf(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!cpfValido(paciente.cpf)) {
            setError("CPF inválido. Informe um CPF válido.");
            return;
        }

        setLoading(true);
        try {
            if (paciente.idPaciente) {
                await axios.put(`${API_BASE_URL}/pacientes/${paciente.idPaciente}`, paciente);
                setSuccess("Paciente atualizado com sucesso!");
            } else {
                await axios.post(`${API_BASE_URL}/pacientes`, paciente);
                setSuccess("Paciente cadastrado com sucesso!");
            }
            setTimeout(() => navigate('/pacientes'), 1500);
        } catch (err) {
            setError(err.response?.data || "Erro ao salvar paciente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h2>{id ? "Editar Paciente" : "Adicionar Paciente"}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control type="text" name="nome" value={paciente.nome} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control
                        type="text"
                        name="cpf"
                        value={paciente.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Data de Nascimento</Form.Label>
                    <Form.Control type="date" name="dataNascimento" value={paciente.dataNascimento} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={paciente.email} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control type="text" name="telefone" value={paciente.telefone} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Endereço</Form.Label>
                    <Form.Control type="text" name="endereco" value={paciente.endereco} onChange={handleChange} />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/pacientes')} className="ms-2">
                    Cancelar
                </Button>
            </Form>
        </Container>
    );
};

export default PacienteCadastro;
