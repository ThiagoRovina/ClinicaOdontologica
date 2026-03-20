package com.sistemaClinica.financeiro.repository;

import com.sistemaClinica.financeiro.model.LancamentoFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LancamentoFinanceiroRepository extends JpaRepository<LancamentoFinanceiro, String> {
    List<LancamentoFinanceiro> findByDataBetweenOrderByDataDesc(LocalDate from, LocalDate to);
}
