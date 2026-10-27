package com.sistemaClinica.financeiro.repository;

import com.sistemaClinica.financeiro.model.LancamentoFinanceiro;
import com.sistemaClinica.financeiro.model.StatusLancamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LancamentoFinanceiroRepository extends JpaRepository<LancamentoFinanceiro, String> {
    List<LancamentoFinanceiro> findByDataBetweenOrderByDataDesc(LocalDate from, LocalDate to);
    List<LancamentoFinanceiro> findByPacienteIdPacienteOrderByDataDesc(Integer pacienteId);
    Optional<LancamentoFinanceiro> findByConsultaIdConsulta(Integer consultaId);
    List<LancamentoFinanceiro> findByStatusAndConsultaIsNotNull(StatusLancamento status);
}
