package com.sistemaClinica.usuario.service;

import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class JpaUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public JpaUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String nmEmail) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNmEmail(nmEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + nmEmail));

        return new User(usuario.getNmEmail(), usuario.getNmSenha(), Collections.emptyList()); // Adapte para suas roles
    }
}
