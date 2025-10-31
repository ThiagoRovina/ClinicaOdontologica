package com.sistemaClinica.prontuario.model;

import com.sistemaClinica.paciente.model.Paciente;
import com.sistemaClinica.procedimento.model.Procedimento;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "PRONTUARIOS")
public class Prontuario {

    @Id
    @Column(name = "id_prontuario")
    private String idProntuario;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_procedimento", nullable = false)
    private Procedimento procedimento;

    @Column(name = "dt_realizacao", nullable = false)
    private LocalDate dataRealizacao;

    @Column(name = "ds_observacoes", length = 1000)
    private String observacoes;
}
