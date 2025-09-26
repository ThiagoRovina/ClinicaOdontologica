import NavBar from "./nav/NavBar";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import PacienteFront from "./Paciente/PacienteFront";
import AgendamentoFront from "./Agendamento/AgendamentoFront";


function App() {
    return (
        <Router>
            <NavBar/>
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<h2>Home</h2>} />
                    <Route path="/Paciente/pacienteFront" element={PacienteFront()} />
                    <Route path="/Agendamento" element={AgendamentoFront()} />
                </Routes>
            </div>
        </Router>

    );

}



export default App;
