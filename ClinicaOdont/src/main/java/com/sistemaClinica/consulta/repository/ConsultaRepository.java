package com.sistemaClinica.consulta.repository;

import com.sistemaClinica.consulta.model.Consulta;
import com.sistemaClinica.consulta.model.StatusConsulta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, String> {
    List<Consulta> findByDataHoraBetweenAndStatus(LocalDateTime start, LocalDateTime end, StatusConsulta status);

    long countByDataHoraBetween(LocalDateTime start, LocalDateTime end);

    long countByDataHoraBetweenAndStatus(LocalDateTime start, LocalDateTime end, StatusConsulta status);

    long countByDentista_IdDentista(String idDentista);

    boolean existsByDentista_IdDentistaAndDataHoraAndStatus(String idDentista, LocalDateTime dataHora, StatusConsulta status);
}
