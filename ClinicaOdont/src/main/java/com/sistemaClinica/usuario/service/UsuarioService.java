package com.sistemaClinica.usuario.service;

import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrar(Usuario novoUsuario) {

        if (usuarioRepository.findByNmEmail(novoUsuario.getNmEmail()).isPresent()) {
            throw new IllegalArgumentException("Este email já está em uso.");
        }
        if (novoUsuario.getIdUsuario() == null || novoUsuario.getIdUsuario().isBlank()) {
            novoUsuario.setIdUsuario(UUID.randomUUID().toString());
        }
        novoUsuario.setNmSenha(passwordEncoder.encode(novoUsuario.getNmSenha()));
        if (novoUsuario.getDsRole() == null || novoUsuario.getDsRole().isBlank()) {
            novoUsuario.setDsRole("ROLE_USER");
        }

        return usuarioRepository.save(novoUsuario);
    }

}
