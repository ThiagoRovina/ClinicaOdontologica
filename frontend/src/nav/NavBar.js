import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navStyle.css";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function NavBar() {
    const { isAuthenticated, user, hasRole, logout } = useAuth();

    const isGerente = hasRole('ROLE_GERENTE');
    const isDentista = hasRole('ROLE_DENTISTA');
    const isRecepcionista = hasRole('ROLE_RECEPCIONISTA');

    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="text-white ms-5">🦷 OdontoSys</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/">Home</Nav.Link>

                                {(isRecepcionista || isGerente) && (
                                    <Nav.Link as={Link} to="/pacientes">Pacientes</Nav.Link>
                                )}

                                {isGerente && (
                                    <Nav.Link as={Link} to="/dentistas">Dentistas</Nav.Link>
                                )}
                                {isGerente && (
                                    <Nav.Link as={Link} to="/funcionarios">Funcionários</Nav.Link>
                                )}

                                {(isRecepcionista || isGerente) && (
                                    <Nav.Link as={Link} to="/agendamento">Agendar</Nav.Link>
                                )}

                                {(isDentista || isGerente) && (
                                    <Nav.Link as={Link} to="/consultas">Consultas</Nav.Link>
                                )}

                                {isGerente && (
                                    <Nav.Link as={Link} to="/procedimentos">Procedimentos</Nav.Link>
                                )}

                                {(isGerente || isRecepcionista) && (
                                    <Nav.Link as={Link} to="/financeiro">Financeiro</Nav.Link>
                                )}

                                <NavDropdown title={user.username} id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={logout}>Sair</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/telaLogin">Login</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
