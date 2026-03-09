package com.sistemaClinica.usuario.controller;

import com.sistemaClinica.funcionario.repository.FuncionarioRepository;
import com.sistemaClinica.usuario.dto.UsuarioLogadoResponse;
import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario novoUsuario) {
        try {
            Usuario usuarioSalvo = usuarioService.registrar(novoUsuario);
            return ResponseEntity.ok(usuarioSalvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioLogadoResponse> getUsuarioLogado(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Usuario usuario = usuarioService.buscarPorEmail(userDetails.getUsername());
        String nome = userDetails.getUsername();

        if (usuario != null && usuario.getNmUsuario() != null && !usuario.getNmUsuario().isBlank()) {
            nome = usuario.getNmUsuario();
        } else {
            nome = funcionarioRepository.findByEmail(userDetails.getUsername())
                    .map(funcionario -> funcionario.getNmFuncionario())
                    .orElse(userDetails.getUsername());
        }

        UsuarioLogadoResponse response = new UsuarioLogadoResponse(
                userDetails.getUsername(),
                nome,
                userDetails.getAuthorities().stream().map(a -> a.getAuthority()).toList()
        );

        return ResponseEntity.ok(response);
    }
}
