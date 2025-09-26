import React from 'react';
import { Card, Container } from 'react-bootstrap';

function AgendamentoFront() {

    return (
        <Container>
            <Card className="mt-4">
                <Card.Header as="h4">Agenda do Dia</Card.Header>
                <Card.Body>
                    <h1>Página de Agendamentos</h1>
                    <p>Aqui ficará a sua agenda, calendário e outras funcionalidades.</p>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AgendamentoFront;
