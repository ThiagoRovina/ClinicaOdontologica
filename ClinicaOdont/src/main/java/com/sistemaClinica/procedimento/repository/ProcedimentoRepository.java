package com.sistemaClinica.procedimento.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sistemaClinica.procedimento.model.Procedimento;

@Repository
public interface ProcedimentoRepository extends JpaRepository<Procedimento, Integer> {
}
