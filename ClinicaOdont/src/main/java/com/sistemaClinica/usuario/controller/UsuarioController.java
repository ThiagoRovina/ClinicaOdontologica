package com.sistemaClinica.usuario.controller;

import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.service.UsuarioService; // Precisaremos criar este serviço
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario novoUsuario) {
        try {
            Usuario usuarioSalvo = usuarioService.registrar(novoUsuario);
            return ResponseEntity.ok(usuarioSalvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
