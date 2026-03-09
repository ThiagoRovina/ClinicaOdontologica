package com.sistemaClinica.funcionario.repository;

import com.sistemaClinica.funcionario.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, String> {
    Optional<Funcionario> findByEmail(String email);
}
