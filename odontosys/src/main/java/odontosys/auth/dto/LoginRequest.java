package com.sistemaClinica.auth.dto;

public record LoginRequest(
        String nmEmail,
        String nmSenha
) {
}
