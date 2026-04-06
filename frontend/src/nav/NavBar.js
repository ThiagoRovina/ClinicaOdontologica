import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navStyle.css";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function NavBar() {
    const { isAuthenticated, user, hasRole, loading, logout } = useAuth();
    const displayName = user?.nome || user?.username;

    const isGerente = hasRole('ROLE_GERENTE');
    const isDentista = hasRole('ROLE_DENTISTA');
    const isRecepcionista = hasRole('ROLE_RECEPCIONISTA');

    // Mostra um skeleton enquanto loading
    if (loading) {
        return (
            <Navbar expand="lg" className="navbar-custom" style={{ justifyContent: 'center', padding: '1rem' }}>
                <div className="navbar-skeleton-text" />
            </Navbar>
        );
    }

    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="text-white ms-4 ms-md-5">
                    <span className="navbar-brand__icon">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M12 5C8 5 5 8 5 12c0 3.314.429 4.5 1.5 6.5 1.071 2 2 3.5 2.5 3.5s1.429-1.5 2.5-3.5C12.571 16.5 13 15.314 13 12c0-3.314-.429-4.5-1.5-6.5C10.5 3.686 9.429 2 9 2s-1.429 1.686-2.5 3.5C5.571 8.071 5.429 9.314 5.429 12c0 3.314 2.586 6 5.586 6S16 15.314 16 12c0-3.674-2-5-4-5s-4 1.326-4 5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className="navbar-brand__text">OdontoSys</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto me-2">
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/" className="nav-link-with-icon">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10"/></svg>
                                    Home
                                </Nav.Link>

                                {(isRecepcionista || isGerente) && (
                                    <Nav.Link as={Link} to="/pacientes" className="nav-link-with-icon">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M17 17v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1"/></svg>
                                        Pacientes
                                    </Nav.Link>
                                )}

                                {isGerente && (
                                    <Nav.Link as={Link} to="/dentistas" className="nav-link-with-icon">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3"/><path d="M12 13v3a3 3 0 016 0v1a3 3 0 01-6 0v-3"/></svg>
                                        Dentistas
                                    </Nav.Link>
                                )}
                                {isGerente && (
                                    <Nav.Link as={Link} to="/funcionarios" className="nav-link-with-icon">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 8h1M13 8h1M9 12h1M13 12h1M9 16h1M13 16h1M17 16v5H7V3"/></svg>
                                        Funcionários
                                    </Nav.Link>
                                )}

                                {(isRecepcionista || isGerente) && (
                                    <Nav.Link as={Link} to="/agendamento" className="nav-link-with-icon">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                                        Agendar
                                    </Nav.Link>
                                )}

                                {(isDentista || isGerente) && (
                                    <Nav.Link as={Link} to="/consultas" className="nav-link-with-icon">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
                                        Consultas
                                    </Nav.Link>
                                )}

                                {isGerente && (
                                    <Nav.Link as={Link} to="/procedimentos" className="nav-link-with-icon">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94L6.73 20.4a1 1 0 01-1.73 0 1 1 0 010-1.73l6.93-6.93A6 6 0 0114.7 6.3z"/></svg>
                                        Procedimentos
                                    </Nav.Link>
                                )}

                                {(isGerente || isRecepcionista) && (
                                    <Nav.Link as={Link} to="/financeiro" className="nav-link-with-icon">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                                        Financeiro
                                    </Nav.Link>
                                )}

                                <NavDropdown
                                    title={
                                        <span className="user-dropdown">
                                            <span className="user-avatar">{displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                                            <span className="user-name">{displayName}</span>
                                        </span>
                                    }
                                    id="user-nav-dropdown"
                                    className="user-dropdown-wrapper"
                                    align="end"
                                >
                                    <NavDropdown.Item onClick={logout}>Sair</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/telaLogin" className="nav-link-with-icon">
                                Entrar
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;