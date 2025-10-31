import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

const FuncionarioCadastro = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Pega o ID da URL se estiver em modo de edição

    const [funcionario, setFuncionario] = useState({
        idFuncionario: '',
        nmFuncionario: '',
        nuMatricula: '',
        cargo: '',
        dataAdmissao: '',
        email: '',
        telefone: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            // Se houver um ID na URL, estamos em modo de edição
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
            // Limpa o formulário se não houver ID (modo de adição)
            setFuncionario({
                idFuncionario: '',
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
    }, [id]); // Executa quando o ID da URL muda

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFuncionario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (funcionario.idFuncionario) {
                // Edição
                await axios.put(`${API_BASE_URL}/funcionarios/${funcionario.idFuncionario}`, funcionario);
                setSuccess("Funcionário atualizado com sucesso!");
            } else {
                // Criação
                await axios.post(`${API_BASE_URL}/funcionarios`, funcionario);
                setSuccess("Funcionário cadastrado com sucesso!");
            }
            // Redireciona para a lista de funcionários após o sucesso
            setTimeout(() => navigate('/funcionarios'), 1500); // Dá um tempo para o usuário ver a mensagem de sucesso
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
            {loading && <Alert variant="info">Carregando dados do funcionário...</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        type="text"
                        name="nmFuncionario"
                        value={funcionario.nmFuncionario}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Matrícula</Form.Label>
                    <Form.Control
                        type="number"
                        name="nuMatricula"
                        value={funcionario.nuMatricula}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control
                        type="text"
                        name="cargo"
                        value={funcionario.cargo}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Data de Admissão</Form.Label>
                    <Form.Control
                        type="date"
                        name="dataAdmissao"
                        value={funcionario.dataAdmissao}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={funcionario.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control
                        type="text"
                        name="telefone"
                        value={funcionario.telefone}
                        onChange={handleChange}
                    />
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
