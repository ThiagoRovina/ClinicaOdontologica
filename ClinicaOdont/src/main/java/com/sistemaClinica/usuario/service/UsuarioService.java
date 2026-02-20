package com.sistemaClinica.usuario.service;

import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Set<String> ROLES_VALIDAS = Set.of(
            "ROLE_GERENTE", "ROLE_DENTISTA", "ROLE_RECEPCIONISTA", "ROLE_USER");

    public Usuario registrar(Usuario novoUsuario) {

        if (usuarioRepository.findByNmEmail(novoUsuario.getNmEmail()).isPresent()) {
            throw new IllegalArgumentException("Este email já está em uso.");
        }

        novoUsuario.setNmSenha(passwordEncoder.encode(novoUsuario.getNmSenha()));

        // Valida a role; se não informada ou inválida, usa ROLE_RECEPCIONISTA como
        // padrão
        String role = novoUsuario.getDsRole();
        if (role == null || role.isBlank() || !ROLES_VALIDAS.contains(role)) {
            novoUsuario.setDsRole("ROLE_RECEPCIONISTA");
        }

        return usuarioRepository.save(novoUsuario);
    }
}
