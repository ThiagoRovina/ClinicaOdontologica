package com.sistemaClinica.procedimento.repository;

import com.sistemaClinica.procedimento.model.Procedimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcedimentoRepository extends JpaRepository<Procedimento, String> {
}
