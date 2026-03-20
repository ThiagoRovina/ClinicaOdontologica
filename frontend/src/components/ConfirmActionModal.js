import { Button, Modal } from 'react-bootstrap';

function ConfirmActionModal({ show, title, body, onCancel, onConfirm, confirmLabel }) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onCancel}>
                    Voltar
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    {confirmLabel || 'Confirmar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmActionModal;
