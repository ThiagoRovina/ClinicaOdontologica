package com.sistemaClinica.config;

import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String email = "thiagorovina428@gmail.com";
            if (usuarioRepository.findByNmEmail(email).isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNmEmail(email);
                admin.setNmSenha(passwordEncoder.encode("thirrasgo26"));
                admin.setDsRole("ROLE_GERENTE");
                usuarioRepository.save(admin);
                System.out.println("Usuário padrão criado: " + email);
            }
        };
    }
}
