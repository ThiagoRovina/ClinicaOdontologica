package com.sistemaClinica.paciente.repository;

import com.sistemaClinica.paciente.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, String> {
    boolean existsByCpf(String cpf);
    Optional<Paciente> findByCpf(String cpf);
}
