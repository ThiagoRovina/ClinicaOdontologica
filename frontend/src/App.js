import NavBar from "./nav/NavBar";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Paciente from "./Paciente/Paciente";
import PacienteCadastro from "./Paciente/PacienteCadastro";
import AgendamentoFront from "./Agendamento/AgendamentoFront";
import Funcionario from "./Funcionario/Funcionario";
import FuncionarioCadastro from "./Funcionario/FuncionarioCadastro";
import Dentista from "./Dentista/Dentista";
import DentistaCadastro from "./Dentista/DentistaCadastro";
import Consultas from "./Consultas/Consultas";
import ConsultasHoje from "./Consultas/ConsultasHoje";
import TelaLogin from "./login/TelaLogin";
import { AuthProvider } from './auth/AuthContext';
import axios from 'axios';
import Dashboard from "./Dashboard/Dashboard";
import Procedimentos from "./Procedimento/Procedimentos";
import Financeiro from "./Financeiro/Financeiro";
import ProntuarioPaciente from "./Prontuario/ProntuarioPaciente";
import ProtectedRoute from "./auth/ProtectedRoute";

axios.defaults.withCredentials = true;

// Wrapper que oculta a NavBar na tela de login
function Layout({ children }) {
    const location = useLocation();
    const hideNavbar = location.pathname === '/telaLogin';
    return (
        <>
            {!hideNavbar && <NavBar />}
            <div className="container-fluid px-0">{children}</div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        <Route path="/telaLogin" element={<TelaLogin />} />

                        <Route path="/" element={
                            <ProtectedRoute><Dashboard /></ProtectedRoute>
                        } />
                        <Route path="/Home" element={
                            <ProtectedRoute><Dashboard /></ProtectedRoute>
                        } />

                        <Route path="/pacientes" element={
                            <ProtectedRoute requiredRoles={['ROLE_RECEPCIONISTA', 'ROLE_GERENTE']}>
                                <Paciente />
                            </ProtectedRoute>
                        } />
                        <Route path="/pacientes/novo" element={
                            <ProtectedRoute requiredRoles={['ROLE_RECEPCIONISTA', 'ROLE_GERENTE']}>
                                <PacienteCadastro />
                            </ProtectedRoute>
                        } />
                        <Route path="/pacientes/editar/:id" element={
                            <ProtectedRoute requiredRoles={['ROLE_RECEPCIONISTA', 'ROLE_GERENTE']}>
                                <PacienteCadastro />
                            </ProtectedRoute>
                        } />
                        <Route path="/pacientes/:id/prontuario" element={
                            <ProtectedRoute requiredRoles={['ROLE_DENTISTA', 'ROLE_GERENTE']}>
                                <ProntuarioPaciente />
                            </ProtectedRoute>
                        } />

                        <Route path="/dentistas" element={
                            <ProtectedRoute requiredRoles={['ROLE_GERENTE']}>
                                <Dentista />
                            </ProtectedRoute>
                        } />
                        <Route path="/dentistas/editar/:id" element={
                            <ProtectedRoute requiredRoles={['ROLE_GERENTE']}>
                                <DentistaCadastro />
                            </ProtectedRoute>
                        } />

                        <Route path="/funcionarios" element={
                            <ProtectedRoute requiredRoles={['ROLE_GERENTE']}>
                                <Funcionario />
                            </ProtectedRoute>
                        } />
                        <Route path="/funcionarios/novo" element={
                            <ProtectedRoute requiredRoles={['ROLE_GERENTE']}>
                                <FuncionarioCadastro />
                            </ProtectedRoute>
                        } />
                        <Route path="/funcionarios/editar/:id" element={
                            <ProtectedRoute requiredRoles={['ROLE_GERENTE']}>
                                <FuncionarioCadastro />
                            </ProtectedRoute>
                        } />

                        <Route path="/agendamento" element={
                            <ProtectedRoute requiredRoles={['ROLE_RECEPCIONISTA', 'ROLE_GERENTE']}>
                                <AgendamentoFront />
                            </ProtectedRoute>
                        } />

                        <Route path="/consultas" element={
                            <ProtectedRoute requiredRoles={['ROLE_DENTISTA', 'ROLE_GERENTE']}>
                                <Consultas />
                            </ProtectedRoute>
                        } />
                        <Route path="/consultas/hoje" element={
                            <ProtectedRoute requiredRoles={['ROLE_DENTISTA', 'ROLE_GERENTE']}>
                                <ConsultasHoje />
                            </ProtectedRoute>
                        } />

                        <Route path="/procedimentos" element={
                            <ProtectedRoute requiredRoles={['ROLE_GERENTE']}>
                                <Procedimentos />
                            </ProtectedRoute>
                        } />
                        <Route path="/financeiro" element={
                            <ProtectedRoute requiredRoles={['ROLE_GERENTE', 'ROLE_RECEPCIONISTA']}>
                                <Financeiro />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Layout>
            </AuthProvider>
        </Router>
    );
}

export default App;