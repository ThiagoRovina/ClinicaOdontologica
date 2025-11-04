package com.sistemaClinica.dentista.repository;

import com.sistemaClinica.dentista.model.Dentista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DentistaRepository extends JpaRepository<Dentista, String> {
}
