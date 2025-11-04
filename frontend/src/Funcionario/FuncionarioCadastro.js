import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

const FuncionarioCadastro = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [funcionario, setFuncionario] = useState({
        nmFuncionario: '',
        nuMatricula: '',
        cargo: '', // Será preenchido pelo dropdown
        dataAdmissao: '',
        email: '',
        telefone: '',
    });
    const [tiposFuncionario, setTiposFuncionario] = useState([]); // Novo estado para os tipos
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // Efeito para buscar os tipos de funcionário
    useEffect(() => {
        axios.get(`${API_BASE_URL}/funcionarios/tipos`)
            .then(response => {
                setTiposFuncionario(response.data);
            })
            .catch(err => {
                console.error("Erro ao buscar tipos de funcionário:", err);
                setError("Não foi possível carregar os tipos de cargo.");
            });
    }, []);

    // Efeito para buscar os dados do funcionário para edição
    useEffect(() => {
        if (id) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/funcionarios/${id}`)
                .then(response => {
                    setFuncionario(response.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Erro ao buscar funcionário para edição:", err);
                    setError("Não foi possível carregar os dados do funcionário para edição.");
                    setLoading(false);
                });
        } else {
            setFuncionario({
                nmFuncionario: '',
                nuMatricula: '',
                cargo: '',
                dataAdmissao: '',
                email: '',
                telefone: '',
            });
        }
        setError(null);
        setSuccess(null);
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFuncionario(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (funcionario.idFuncionario) {
                await axios.put(`${API_BASE_URL}/funcionarios/${funcionario.idFuncionario}`, funcionario);
                setSuccess("Funcionário atualizado com sucesso!");
            } else {
                await axios.post(`${API_BASE_URL}/funcionarios`, funcionario);
                setSuccess("Funcionário cadastrado com sucesso!");
            }
            setTimeout(() => navigate('/funcionarios'), 1500);
        } catch (err) {
            console.error("Erro ao salvar funcionário:", err);
            setError("Erro ao salvar funcionário. Verifique os dados e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h2>{id ? "Editar Funcionário" : "Adicionar Funcionário"}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                {/* ... outros campos do formulário ... */}
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" name="nmFuncionario" value={funcionario.nmFuncionario} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Matrícula</Form.Label>
                    <Form.Control type="number" name="nuMatricula" value={funcionario.nuMatricula} onChange={handleChange} required />
                </Form.Group>

                {/* Campo de Cargo alterado para um dropdown */}
                <Form.Group className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Select
                        name="cargo"
                        value={funcionario.cargo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um cargo</option>
                        {tiposFuncionario.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Data de Admissão</Form.Label>
                    <Form.Control type="date" name="dataAdmissao" value={funcionario.dataAdmissao} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={funcionario.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control type="text" name="telefone" value={funcionario.telefone} onChange={handleChange} />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button variant="secondary" onClick={() => navigate('/funcionarios')} className="ms-2">
                    Cancelar
                </Button>
            </Form>
        </Container>
    );
};

export default FuncionarioCadastro;
