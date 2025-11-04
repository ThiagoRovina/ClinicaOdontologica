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
import { AuthProvider } from './auth/AuthContext';
import axios from 'axios'; // Importa o axios

// Configuração global do Axios para enviar cookies com cada requisição
axios.defaults.withCredentials = true;

function App() {
    return (
        <Router>
            <AuthProvider>
                <NavBar/>
                <div className="container mt-4">
                    <Routes>
                        <Route path="/telaLogin" element={<TelaLogin />} />
                        <Route path="/registrar" element={<TelaCadastro />} />

                        <Route path="/" element={<h2>Home</h2>} />
                        <Route path="/Home" element={<h2>Home</h2>} />
                        
                        <Route path="/pacientes" element={<Paciente />} />
                        <Route path="/pacientes/novo" element={<PacienteCadastro />} />
                        <Route path="/pacientes/editar/:id" element={<PacienteCadastro />} />

                        <Route path="/dentistas" element={<Dentista />} />
                        <Route path="/dentistas/novo" element={<DentistaCadastro />} />
                        <Route path="/dentistas/editar/:id" element={<DentistaCadastro />} />

                        <Route path="/funcionarios" element={<Funcionario />} />
                        <Route path="/funcionarios/novo" element={<FuncionarioCadastro />} />
                        <Route path="/funcionarios/editar/:id" element={<FuncionarioCadastro />} />
                        
                        <Route path="/agendamento" element={<AgendamentoFront />} />

                        <Route path="/consultas" element={<Consultas />} />
                        <Route path="/consultas/hoje" element={<ConsultasHoje />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>

    );

}

export default App;
