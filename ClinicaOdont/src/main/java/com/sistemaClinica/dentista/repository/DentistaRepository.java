package com.sistemaClinica.dentista.repository;

import com.sistemaClinica.dentista.model.Dentista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DentistaRepository extends JpaRepository<Dentista, String> {
    Optional<Dentista> findByFuncionario_IdFuncionario(String idFuncionario);
    boolean existsByCro(String cro);
    void deleteByFuncionario_IdFuncionario(String idFuncionario);
}
