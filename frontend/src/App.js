import NavBar from "./nav/NavBar";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import PacienteFront from "./Paciente/PacienteFront";
import AgendamentoFront from "./Agendamento/AgendamentoFront";
import Funcionario from "./Funcionario/Funcionario";
import FuncionarioCadastro from "./Funcionario/FuncionarioCadastro";
import TelaLogin from "./login/TelaLogin";
import TelaCadastro from "./login/TelaCadastro"; // Importa o novo componente de cadastro

function App() {
    return (
        <Router>
            <NavBar/>
            <div className="container mt-4">
                <Routes>
                    {/* Rotas de Login e Cadastro */}
                    <Route path="/telaLogin" element={<TelaLogin />} />
                    <Route path="/registrar" element={<TelaCadastro />} /> {/* Rota para a tela de cadastro */}

                    {/* Rotas da Aplicação */}
                    <Route path="/" element={<h2>Home</h2>} />
                    <Route path="/Home" element={<h2>Home</h2>} />
                    <Route path="/Paciente/pacienteFront" element={<PacienteFront />} />
                    <Route path="/funcionarios" element={<Funcionario />} />
                    <Route path="/funcionarios/novo" element={<FuncionarioCadastro />} />
                    <Route path="/funcionarios/editar/:id" element={<FuncionarioCadastro />} />
                    <Route path="/Agendamento" element={<AgendamentoFront />} />
                </Routes>
            </div>
        </Router>

    );

}

export default App;
