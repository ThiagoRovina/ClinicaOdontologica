package com.sistemaClinica.prontuario.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sistemaClinica.prontuario.model.Prontuario;

@Repository
public interface ProntuarioRepository extends JpaRepository<Prontuario, Integer> {
    List<Prontuario> findByPacienteIdPacienteOrderByDataRealizacaoDesc(Integer pacienteId);

    @Query("""
            select coalesce(sum(p.procedimento.valor), 0)
            from Prontuario p
            where p.dataRealizacao between :dataInicio and :dataFim
            """)
    BigDecimal somarValorTotalPorPeriodo(@Param("dataInicio") LocalDate dataInicio, @Param("dataFim") LocalDate dataFim);

    long countByDataRealizacaoBetween(LocalDate dataInicio, LocalDate dataFim);
}
