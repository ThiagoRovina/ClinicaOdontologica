import React from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navStyle.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, hasRole, logout } = useAuth();

    const isGerente = hasRole('ROLE_GERENTE');
    const isDentista = hasRole('ROLE_DENTISTA');
    const isAdministrativo = hasRole('ROLE_ADMINISTRATIVO');

    const handleLogout = async () => {
        await logout();
        navigate('/telaLogin');
    };

    return (
        <Navbar expand="lg" className="navbar-custom sticky-top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="text-white ms-3">OdontoSys</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Home</Nav.Link>

                                {(isAdministrativo || isGerente) && (
                                    <Nav.Link as={Link} to="/pacientes" active={location.pathname.startsWith('/pacientes')}>Pacientes</Nav.Link>
                                )}

                                {isGerente && (
                                    <Nav.Link as={Link} to="/dentistas" active={location.pathname.startsWith('/dentistas')}>Dentistas</Nav.Link>
                                )}
                                {isGerente && (
                                    <Nav.Link as={Link} to="/funcionarios" active={location.pathname.startsWith('/funcionarios')}>Funcionarios</Nav.Link>
                                )}
                                {isGerente && (
                                    <Nav.Link as={Link} to="/procedimentos" active={location.pathname.startsWith('/procedimentos')}>Procedimentos</Nav.Link>
                                )}

                                {(isAdministrativo || isGerente) && (
                                    <Nav.Link as={Link} to="/agendamento" active={location.pathname.startsWith('/agendamento')}>Agenda</Nav.Link>
                                )}

                                {(isDentista || isGerente) && (
                                    <Nav.Link as={Link} to="/consultas" active={location.pathname.startsWith('/consultas')}>Consultas</Nav.Link>
                                )}
                                {isGerente && (
                                    <Nav.Link as={Link} to="/relatorios" active={location.pathname.startsWith('/relatorios')}>Relatorios</Nav.Link>
                                )}

                                <NavDropdown title={<span>{user.email} <Badge bg="light" text="dark">online</Badge></span>} id="basic-nav-dropdown" align="end">
                                    <NavDropdown.Item onClick={handleLogout}>Sair</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/telaLogin">Login</Nav.Link>
                                <Nav.Link as={Link} to="/registrar">Registrar</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
