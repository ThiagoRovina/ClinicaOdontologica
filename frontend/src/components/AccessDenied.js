import { Card, Container } from 'react-bootstrap';

function AccessDenied() {
    return (
        <Container className="page-shell">
            <Card className="surface-card text-center">
                <Card.Body className="py-5">
                    <span className="eyebrow">Acesso restrito</span>
                    <h1 className="section-title mt-2">Voce nao tem permissao para acessar esta area.</h1>
                    <p className="section-subtitle mb-0">
                        Entre com um perfil autorizado ou use o menu para acessar as funcionalidades disponiveis para voce.
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AccessDenied;
