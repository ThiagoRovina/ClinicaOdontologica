package com.sistemaClinica.prontuario.repository;

import com.sistemaClinica.prontuario.model.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, String> {
    List<Prontuario> findByPaciente_IdPacienteOrderByDataRealizacaoDesc(String idPaciente);
}
