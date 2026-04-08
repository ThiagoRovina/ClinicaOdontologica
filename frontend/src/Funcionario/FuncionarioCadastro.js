import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { tratarErroBackend } from '../ultilitarios/ultilitarios';

const FuncionarioCadastro = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [funcionario, setFuncionario] = useState({ nmFuncionario: '', nuMatricula: '', cargo: '', dataAdmissao: '', email: '', telefone: '', senha: '', confirmarSenha: '' });
    const [tiposFuncionario, setTiposFuncionario] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/funcionarios/tipos`)
            .then(response => setTiposFuncionario(response.data))
            .catch(() => setError('Nao foi possivel carregar os tipos de cargo.'));
    }, []);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            axios.get(`${API_BASE_URL}/funcionarios/${id}`)
                .then(response => { setFuncionario(prev => ({ ...prev, ...response.data })); setLoading(false); })
                .catch(() => { setError('Nao foi possivel carregar os dados.'); setLoading(false); });
        }
    }, [id, isEditMode]);

    useEffect(() => { if (success) { const t = setTimeout(() => setSuccess(null), 5000); return () => clearTimeout(t); } }, [success]);

    const handleChange = (e) => { setFuncionario(prev => ({ ...prev, [e.target.name]: e.target.value })); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!isEditMode && funcionario.senha !== funcionario.confirmarSenha) { setError('As senhas nao coincidem.'); return; }

        setLoading(true);
        try {
            if (isEditMode) {
                await axios.put(`${API_BASE_URL}/funcionarios/${id}`, funcionario);
                setSuccess('Funcionario atualizado com sucesso!');
                setTimeout(() => navigate('/funcionarios'), 1500);
            } else {
                const response = await axios.post(`${API_BASE_URL}/funcionarios/cadastrar`, funcionario);
                const idDentista = response?.data?.idDentista;
                if (funcionario.cargo === 'DENTISTA' && idDentista) {
                    setSuccess('Funcionario dentista criado. Complete os dados clinicos (CRO e especializacao).');
                    setTimeout(() => navigate(`/dentistas/editar/${idDentista}`), 1500);
                } else {
                    setSuccess('Funcionario e Usuario cadastrados com sucesso!');
                    setTimeout(() => navigate('/funcionarios'), 1500);
                }
            }
        } catch (err) { setError(tratarErroBackend(err, 'Erro ao salvar funcionario.')); }
        finally { setLoading(false); }
    };

    return (
        <Container className="page-shell">
            <div className="page-header">
                <div>
                    <span className="eyebrow">Equipe interna</span>
                    <h1 className="section-title">{isEditMode ? 'Editar Funcionario' : 'Novo Funcionario'}</h1>
                    <p className="section-subtitle">Cadastre as informacoes profissionais e crie o usuario de acesso.</p>
                </div>
                <Button variant="outline-secondary" className="rounded-pill" onClick={() => navigate('/funcionarios')}>Voltar</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Card className="surface-card">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <Form.Label className="fw-medium small">Nome</Form.Label>
                                <Form.Control type="text" name="nmFuncionario" value={funcionario.nmFuncionario} onChange={handleChange} required className="toolbar-input" />
                            </div>
                            <div className="col-md-6">
                                <Form.Label className="fw-medium small">Email</Form.Label>
                                <Form.Control type="email" name="email" value={funcionario.email} onChange={handleChange} required disabled={isEditMode} className="toolbar-input" />
                            </div>

                            {!isEditMode && (
                                <>
                                    <div className="col-md-6">
                                        <Form.Label className="fw-medium small">Senha</Form.Label>
                                        <Form.Control type="password" name="senha" value={funcionario.senha} onChange={handleChange} required className="toolbar-input" />
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Label className="fw-medium small">Confirmar Senha</Form.Label>
                                        <Form.Control type="password" name="confirmarSenha" value={funcionario.confirmarSenha} onChange={handleChange} required className="toolbar-input" />
                                    </div>
                                </>
                            )}

                            <div className="col-md-4">
                                <Form.Label className="fw-medium small">Matricula</Form.Label>
                                <Form.Control type="number" name="nuMatricula" value={funcionario.nuMatricula} onChange={handleChange} required className="toolbar-input" />
                            </div>
                            <div className="col-md-4">
                                <Form.Label className="fw-medium small">Cargo</Form.Label>
                                <Form.Select name="cargo" value={funcionario.cargo} onChange={handleChange} required className="toolbar-input">
                                    <option value="">Selecione</option>
                                    {tiposFuncionario.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                                </Form.Select>
                            </div>
                            <div className="col-md-4">
                                <Form.Label className="fw-medium small">Data de Admissao</Form.Label>
                                <Form.Control type="date" name="dataAdmissao" value={funcionario.dataAdmissao} onChange={handleChange} required className="toolbar-input" />
                            </div>
                            <div className="col-md-6">
                                <Form.Label className="fw-medium small">Telefone</Form.Label>
                                <Form.Control type="text" name="telefone" value={funcionario.telefone} onChange={handleChange} className="toolbar-input" />
                            </div>
                        </div>

                        <div className="d-flex gap-2 pt-2">
                            <Button variant="dark" type="submit" className="rounded-pill px-4" disabled={loading}>
                                {loading ? 'Salvando...' : 'Salvar Funcionario'}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => navigate('/funcionarios')} className="rounded-pill px-4">
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FuncionarioCadastro;