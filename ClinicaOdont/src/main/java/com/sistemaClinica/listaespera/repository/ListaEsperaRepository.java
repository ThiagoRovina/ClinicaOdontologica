package com.sistemaClinica.listaespera.repository;

import com.sistemaClinica.listaespera.model.ListaEspera;
import com.sistemaClinica.listaespera.model.StatusListaEspera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ListaEsperaRepository extends JpaRepository<ListaEspera, String> {

    List<ListaEspera> findByStatusOrderByDataSolicitacaoAsc(StatusListaEspera status);

    boolean existsByPaciente_IdPacienteAndDentista_IdDentistaAndDataPreferidaAndStatus(
            String idPaciente,
            String idDentista,
            LocalDate dataPreferida,
            StatusListaEspera status
    );

    @Query("""
            select le from ListaEspera le
            where le.status = com.sistemaClinica.listaespera.model.StatusListaEspera.ATIVA
              and le.dentista.idDentista = :idDentista
              and le.dataPreferida = :data
              and ((le.horarioInicioPreferido is null or le.horarioInicioPreferido <= :horario)
               and (le.horarioFimPreferido is null or le.horarioFimPreferido >= :horario))
            order by le.dataSolicitacao asc
            """)
    List<ListaEspera> buscarCandidatosParaEncaixe(@Param("idDentista") String idDentista,
                                                  @Param("data") LocalDate data,
                                                  @Param("horario") LocalTime horario);
}
