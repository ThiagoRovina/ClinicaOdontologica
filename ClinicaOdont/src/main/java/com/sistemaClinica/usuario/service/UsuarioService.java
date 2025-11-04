package com.sistemaClinica.usuario.service;

import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrar(Usuario novoUsuario) {
        // Verifica se o email já está em uso
        if (usuarioRepository.findByNmEmail(novoUsuario.getNmEmail()).isPresent()) {
            throw new IllegalArgumentException("Este email já está em uso.");
        }

        // Criptografa a senha antes de salvar
        novoUsuario.setNmSenha(passwordEncoder.encode(novoUsuario.getNmSenha()));

        // Define uma role padrão para novos usuários
        novoUsuario.setDsRole("ROLE_USER"); // Ou outra role padrão que você queira

        return usuarioRepository.save(novoUsuario);
    }
}
