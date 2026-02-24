import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const FuncionarioForm = ({ show, handleClose, funcionarioParaEditar, onSaveSuccess }) => {
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

    useEffect(() => {
        if (funcionarioParaEditar) {
            setFuncionario(funcionarioParaEditar);
        } else {
            // Limpa o formulário se não houver funcionário para editar
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
    }, [funcionarioParaEditar, show]); // Resetar quando o modal for mostrado ou o funcionarioParaEditar mudar

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

        try {
            let response;
            if (funcionario.idFuncionario) {
                // Edição
                response = await axios.put(`${API_BASE_URL}/funcionarios/${funcionario.idFuncionario}`, funcionario);
                setSuccess("Funcionário atualizado com sucesso!");
            } else {
                // Criação
                response = await axios.post(`${API_BASE_URL}/funcionarios`, funcionario);
                setSuccess("Funcionário cadastrado com sucesso!");
            }
            onSaveSuccess(); // Notifica o componente pai para atualizar a lista
            handleClose(); // Fecha o modal
        } catch (err) {
            console.error("Erro ao salvar funcionário:", err);
            setError("Erro ao salvar funcionário. Verifique os dados e tente novamente.");
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{funcionario.idFuncionario ? "Editar Funcionário" : "Adicionar Funcionário"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                    <Button variant="primary" type="submit">
                        Salvar
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default FuncionarioForm;
