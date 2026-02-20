import NavBar from "./nav/NavBar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import { AuthProvider } from './auth/AuthContext';
import axios from 'axios';
import Dashboard from "./Dashboard/Dashboard";
import Procedimentos from "./Procedimento/Procedimentos";
import Financeiro from "./Financeiro/Financeiro";
import ProntuarioPaciente from "./Prontuario/ProntuarioPaciente";

// Configuração global do Axios para enviar cookies com cada requisição
axios.defaults.withCredentials = true;

function App() {
    return (
        <Router>
            <AuthProvider>
                <NavBar />
                <div className="container-fluid px-0">
                    <Routes>
                        <Route path="/telaLogin" element={<TelaLogin />} />
                        <Route path="/registrar" element={<TelaCadastro />} />

                        <Route path="/" element={<Dashboard />} />
                        <Route path="/Home" element={<Dashboard />} />

                        <Route path="/pacientes" element={<Paciente />} />
                        <Route path="/pacientes/novo" element={<PacienteCadastro />} />
                        <Route path="/pacientes/editar/:id" element={<PacienteCadastro />} />
                        <Route path="/pacientes/:id/prontuario" element={<ProntuarioPaciente />} />

                        <Route path="/dentistas" element={<Dentista />} />
                        <Route path="/dentistas/novo" element={<DentistaCadastro />} />
                        <Route path="/dentistas/editar/:id" element={<DentistaCadastro />} />

                        <Route path="/funcionarios" element={<Funcionario />} />
                        <Route path="/funcionarios/novo" element={<FuncionarioCadastro />} />
                        <Route path="/funcionarios/editar/:id" element={<FuncionarioCadastro />} />

                        <Route path="/agendamento" element={<AgendamentoFront />} />

                        <Route path="/consultas" element={<Consultas />} />
                        <Route path="/consultas/hoje" element={<ConsultasHoje />} />

                        <Route path="/procedimentos" element={<Procedimentos />} />
                        <Route path="/financeiro" element={<Financeiro />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );

}

export default App;
