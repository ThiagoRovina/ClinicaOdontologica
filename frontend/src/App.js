import NavBar from "./nav/NavBar";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
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
import TelaCadastro from "./login/TelaCadastro";
import { AuthProvider, useAuth } from './auth/AuthContext';
import Home from "./Home";
import AccessDenied from "./components/AccessDenied";
import Procedimento from "./Procedimento/Procedimento";
import ProcedimentoCadastro from "./Procedimento/ProcedimentoCadastro";
import ProntuarioPage from "./Prontuario/ProntuarioPage";
import Relatorios from "./Relatorios/Relatorios";

function ProtectedRoute({ children, roles }) {
    const { loading, isAuthenticated, hasRole } = useAuth();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <TelaLogin />;
    }

    if (roles && !roles.some((role) => hasRole(role))) {
        return <AccessDenied />;
    }

    return children;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <NavBar/>
                <div className="container mt-4">
                    <Routes>
                        <Route path="/telaLogin" element={<TelaLogin />} />
                        <Route path="/registrar" element={<TelaCadastro />} />

                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

                        <Route path="/pacientes" element={<ProtectedRoute roles={['ROLE_ADMINISTRATIVO', 'ROLE_GERENTE']}><Paciente /></ProtectedRoute>} />
                        <Route path="/pacientes/novo" element={<ProtectedRoute roles={['ROLE_ADMINISTRATIVO', 'ROLE_GERENTE']}><PacienteCadastro /></ProtectedRoute>} />
                        <Route path="/pacientes/editar/:id" element={<ProtectedRoute roles={['ROLE_ADMINISTRATIVO', 'ROLE_GERENTE']}><PacienteCadastro /></ProtectedRoute>} />
                        <Route path="/pacientes/:id/prontuario" element={<ProtectedRoute roles={['ROLE_ADMINISTRATIVO', 'ROLE_GERENTE', 'ROLE_DENTISTA']}><ProntuarioPage /></ProtectedRoute>} />

                        <Route path="/dentistas" element={<ProtectedRoute roles={['ROLE_GERENTE']}><Dentista /></ProtectedRoute>} />
                        <Route path="/dentistas/novo" element={<ProtectedRoute roles={['ROLE_GERENTE']}><DentistaCadastro /></ProtectedRoute>} />
                        <Route path="/dentistas/editar/:id" element={<ProtectedRoute roles={['ROLE_GERENTE']}><DentistaCadastro /></ProtectedRoute>} />

                        <Route path="/funcionarios" element={<ProtectedRoute roles={['ROLE_GERENTE']}><Funcionario /></ProtectedRoute>} />
                        <Route path="/funcionarios/novo" element={<ProtectedRoute roles={['ROLE_GERENTE']}><FuncionarioCadastro /></ProtectedRoute>} />
                        <Route path="/funcionarios/editar/:id" element={<ProtectedRoute roles={['ROLE_GERENTE']}><FuncionarioCadastro /></ProtectedRoute>} />

                        <Route path="/agendamento" element={<ProtectedRoute roles={['ROLE_ADMINISTRATIVO', 'ROLE_GERENTE']}><AgendamentoFront /></ProtectedRoute>} />
                        <Route path="/procedimentos" element={<ProtectedRoute roles={['ROLE_GERENTE']}><Procedimento /></ProtectedRoute>} />
                        <Route path="/procedimentos/novo" element={<ProtectedRoute roles={['ROLE_GERENTE']}><ProcedimentoCadastro /></ProtectedRoute>} />
                        <Route path="/procedimentos/editar/:id" element={<ProtectedRoute roles={['ROLE_GERENTE']}><ProcedimentoCadastro /></ProtectedRoute>} />
                        <Route path="/relatorios" element={<ProtectedRoute roles={['ROLE_GERENTE']}><Relatorios /></ProtectedRoute>} />

                        <Route path="/consultas" element={<ProtectedRoute roles={['ROLE_DENTISTA', 'ROLE_GERENTE']}><Consultas /></ProtectedRoute>} />
                        <Route path="/consultas/hoje" element={<ProtectedRoute roles={['ROLE_DENTISTA', 'ROLE_GERENTE']}><ConsultasHoje /></ProtectedRoute>} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>

    );

}

export default App;
