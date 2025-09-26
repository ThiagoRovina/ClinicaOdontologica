import React, { useState, useEffect } from 'react';
// 1. IMPORTAÇÕES: Todos os componentes abaixo serão usados no JSX
import { Container, Row, Col, Form, Button, Table, Card } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pacientes';

function PacienteFront() {

    const [formData, setFormData] = useState({
        id: null, nome: '', cpf: '', dataNascimento: '', telefone: '', email: '',
        cep: '', endereco: '', numero: '', bairro: '', cidade: '', estado: ''
    });
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        carregarPacientes();
    }, []);

    const carregarPacientes = async () => {
        try {
            const response = await axios.get(API_URL);
            setPacientes(response.data);
        } catch (error) {
            console.error("Erro ao buscar pacientes:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await axios.put(`${API_URL}/${formData.id}`, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            carregarPacientes();
            handleClear();
        } catch (error) {
            console.error("Erro ao salvar paciente:", error);
        }
    };

    const handleClear = () => {
        setFormData({
            id: null, nome: '', cpf: '', dataNascimento: '', telefone: '', email: '',
            cep: '', endereco: '', numero: '', bairro: '', cidade: '', estado: ''
        });
    };

    const handleEdit = (paciente) => {
        setFormData(paciente);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            carregarPacientes();
        } catch (error) {
            console.error("Erro ao excluir paciente:", error);
        }
    };

    // 2. O RETURN COM O JSX: É aqui que tudo é efetivamente USADO
    return (
        <Container fluid>
            <Card className="mt-4">
                <Card.Header as="h4">Cadastro de Paciente</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="formNome">
                                <Form.Label>Nome Completo</Form.Label>
                                <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group as={Col} md="3" controlId="formCpf">
                                <Form.Label>CPF</Form.Label>
                                <Form.Control type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group as={Col} md="3" controlId="formNascimento">
                                <Form.Label>Data de Nascimento</Form.Label>
                                <Form.Control type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
                            </Form.Group>
                        </Row>
                        <div className="mt-4">
                            <Button variant="primary" type="submit" className="me-2">Salvar</Button>
                            <Button variant="secondary" type="button" onClick={handleClear}>Limpar</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="mt-4">
                <Card.Header as="h4">Pacientes Cadastrados</Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Telefone</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pacientes.map((paciente) => (
                            <tr key={paciente.id}>
                                <td>{paciente.nome}</td>
                                <td>{paciente.cpf}</td>
                                <td>{paciente.telefone}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(paciente)} className="me-2">Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(paciente.id)}>Excluir</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default PacienteFront;