package com.sistemaClinica.consulta.model;

import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.paciente.model.Paciente;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "CONSULTAS")
public class Consulta {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_consulta")
    private String idConsulta;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_dentista", nullable = false)
    private Dentista dentista;

    @Column(name = "dt_hora_consulta", nullable = false)
    private LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "ds_status", nullable = false)
    private StatusConsulta status;

    @Column(name = "ds_observacoes")
    private String observacoes;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = StatusConsulta.AGENDADA;
        }
    }
}
