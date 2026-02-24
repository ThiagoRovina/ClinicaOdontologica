package com.sistemaClinica.auth.dto;

import java.util.List;

public record LoginResponse(
        String username,
        List<String> roles
) {
}
