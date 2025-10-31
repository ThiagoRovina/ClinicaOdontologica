import NavBar from "./nav/NavBar";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import PacienteFront from "./Paciente/PacienteFront";
import AgendamentoFront from "./Agendamento/AgendamentoFront";
import Funcionario from "./Funcionario/Funcionario";
import FuncionarioCadastro from "./Funcionario/FuncionarioCadastro"; // Importa o novo componente de cadastro

function App() {
    return (
        <Router>
            <NavBar/>
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<h2>Home</h2>} />
                    <Route path="/Paciente/pacienteFront" element={<PacienteFront />} />
                    <Route path="/funcionarios" element={<Funcionario />} />
                    <Route path="/funcionarios/novo" element={<FuncionarioCadastro />} /> {/* Rota para adicionar */}
                    <Route path="/funcionarios/editar/:id" element={<FuncionarioCadastro />} /> {/* Rota para editar */}
                    <Route path="/Agendamento" element={<AgendamentoFront />} />
                </Routes>
            </div>
        </Router>

    );

}

export default App;
