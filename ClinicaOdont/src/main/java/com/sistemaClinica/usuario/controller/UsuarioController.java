package com.sistemaClinica.usuario.controller;

import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrarUsuario(@Valid @RequestBody Usuario novoUsuario) {
        Usuario usuarioSalvo = usuarioService.registrar(novoUsuario);
        return ResponseEntity.ok(usuarioSalvo);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUsuarioLogado(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        Map<String, Object> userInfo = Map.of(
            "email", userDetails.getUsername(),
            "roles", roles
        );

        return ResponseEntity.ok(userInfo);
    }
}
