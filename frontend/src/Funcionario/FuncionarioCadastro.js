import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const FuncionarioCadastro = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [funcionario, setFuncionario] = useState({
        nmFuncionario: '',
        nuMatricula: '',
        cargo: '',
        dataAdmissao: '',
        email: '',
        telefone: '',
        senha: '', // Novo campo
        confirmarSenha: '' // Novo campo
    });
    const [tiposFuncionario, setTiposFuncionario] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/funcionarios/tipos`)
            .then(response => {
                setTiposFuncionario(response.data);
            })
            .catch(err => {
                setError("Não foi possível carregar os tipos de cargo.");
            });
    }, []);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/funcionarios/${id}`)
                .then(response => {
                    setFuncionario(prev => ({ ...prev, ...response.data }));
                    setLoading(false);
                })
                .catch(err => {
                    setError("Não foi possível carregar os dados do funcionário.");
                    setLoading(false);
                });
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFuncionario(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!isEditMode && funcionario.senha !== funcionario.confirmarSenha) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            if (isEditMode) {
                // A lógica de edição não altera a senha aqui, seria em outra tela
                await axios.put(`${API_BASE_URL}/funcionarios/${id}`, funcionario);
                setSuccess("Funcionário atualizado com sucesso!");
            } else {
                // Usa o novo endpoint para cadastrar funcionário e usuário
                await axios.post(`${API_BASE_URL}/funcionarios/cadastrar`, funcionario);
                setSuccess("Funcionário e Usuário cadastrados com sucesso!");
            }
            setTimeout(() => navigate('/funcionarios'), 1500);
        } catch (err) {
            const errorMsg = err.response?.data || "Erro ao salvar funcionário. Verifique os dados e tente novamente.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h2>{isEditMode ? "Editar Funcionário" : "Adicionar Funcionário"}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" name="nmFuncionario" value={funcionario.nmFuncionario} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={funcionario.email} onChange={handleChange} required disabled={isEditMode} />
                </Form.Group>

                {/* Campos de senha aparecem apenas no modo de cadastro */}
                {!isEditMode && (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" name="senha" value={funcionario.senha} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar Senha</Form.Label>
                            <Form.Control type="password" name="confirmarSenha" value={funcionario.confirmarSenha} onChange={handleChange} required />
                        </Form.Group>
                    </>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>Matrícula</Form.Label>
                    <Form.Control type="number" name="nuMatricula" value={funcionario.nuMatricula} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Select name="cargo" value={funcionario.cargo} onChange={handleChange} required>
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
