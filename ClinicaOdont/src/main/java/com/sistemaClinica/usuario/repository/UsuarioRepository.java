package com.sistemaClinica.usuario.repository;

import com.sistemaClinica.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    Optional<Usuario> findByNmEmail(String nmEmail);
    void deleteByNmEmail(String nmEmail);
}
