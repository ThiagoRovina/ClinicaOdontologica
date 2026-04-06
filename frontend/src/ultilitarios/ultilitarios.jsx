import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Modal de confirmação de exclusão reutilizável
 */
export const ConfirmarExclusao = ({ show, titulo, mensagem, onConfirm, onCancel, loading = false }) => (
    <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton>
            <Modal.Title>{titulo || 'Confirmar Exclusão'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{mensagem || 'Tem certeza que deseja excluir este item?'}</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancelar</Button>
            <Button variant="danger" onClick={onConfirm} disabled={loading}>
                {loading ? 'Excluindo...' : 'Excluir'}
            </Button>
        </Modal.Footer>
    </Modal>
);

/**
 * Formata número como moeda brasileira (R$)
 */
export const formatarMoeda = (valor) => {
    if (valor == null || isNaN(valor)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
};

/**
 * Máscara de telefone: (XX) XXXXX-XXXX
 */
export const aplicarMascaraTelefone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : '';
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

/**
 * Garante que o erro do backend seja uma string legível
 */
export const tratarErroBackend = (err, fallback = 'Ocorreu um erro inesperado.') => {
    const data = err?.response?.data;
    if (typeof data === 'string') return data.substring(0, 500);
    if (data?.message && typeof data.message === 'string') return data.message.substring(0, 500);
    if (data?.error && typeof data.error === 'string') return data.error.substring(0, 500);
    return fallback;
};

/**
 * Hook simples para alertas com auto-dismiss
 */
export const useAlertaTimer = () => {
    const [alerta, setAlerta] = React.useState(null);

    const mostrarAlerta = React.useCallback((tipo, mensagem, duracao = 5000) => {
        setAlerta({ tipo, mensagem });
        if (duracao > 0) {
            setTimeout(() => setAlerta(null), duracao);
        }
    }, []);

    return { alerta, setAlerta, mostrarAlerta };
};