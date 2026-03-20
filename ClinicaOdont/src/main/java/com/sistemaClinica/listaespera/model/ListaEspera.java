package com.sistemaClinica.listaespera.model;

import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.paciente.model.Paciente;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "LISTA_ESPERA")
public class ListaEspera {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_lista_espera")
    private String idListaEspera;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_dentista", nullable = false)
    private Dentista dentista;

    @Column(name = "dt_preferida", nullable = false)
    private LocalDate dataPreferida;

    @Column(name = "hr_inicio_preferido")
    private LocalTime horarioInicioPreferido;

    @Column(name = "hr_fim_preferido")
    private LocalTime horarioFimPreferido;

    @Enumerated(EnumType.STRING)
    @Column(name = "ds_status", nullable = false)
    private StatusListaEspera status;

    @Column(name = "dt_solicitacao", nullable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "ds_observacoes")
    private String observacoes;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = StatusListaEspera.ATIVA;
        }
        if (dataSolicitacao == null) {
            dataSolicitacao = LocalDateTime.now();
        }
    }
}
