package com.sistemaClinica.prontuario.model;

import com.sistemaClinica.dentista.model.Dentista;
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
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_prontuario")
    private String idProntuario;

    @Column(name = "ds_titulo")
    private String titulo;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_dentista")
    private Dentista dentista;

    @ManyToOne
    @JoinColumn(name = "id_procedimento")
    private Procedimento procedimento;

    @Column(name = "dt_realizacao", nullable = false)
    private LocalDate dataRealizacao;

    @Column(name = "ds_observacoes", length = 2000)
    private String observacoes;
}
