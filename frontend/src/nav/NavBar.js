import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navStyle.css";
import {Link} from "react-router-dom";

function NavBar() {
    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="text-white ms-5">SorriMais </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="ms-auto">
                        <Nav.Link  as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="./Paciente/pacienteFront">Pacientes</Nav.Link>
                        <Nav.Link as={Link} to="/Agendamento">Agendamentos</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;