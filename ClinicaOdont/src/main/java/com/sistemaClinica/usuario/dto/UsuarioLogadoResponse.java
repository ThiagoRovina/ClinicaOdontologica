package com.sistemaClinica.usuario.dto;

import java.util.List;

public record UsuarioLogadoResponse(
        String username,
        String nome,
        List<String> authorities
) {
}
