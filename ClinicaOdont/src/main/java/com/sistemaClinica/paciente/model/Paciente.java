package com.sistemaClinica.paciente.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "PACIENTES")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_paciente")
    private String idPaciente;

    @Column(name = "nm_paciente", nullable = false)
    private String nome;

    @Column(name = "dt_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(name = "ds_endereco")
    private String endereco;

    @Column(name = "nu_telefone", nullable = false)
    private String telefone;

    @Column(name = "ds_email", unique = true)
    private String email;

    @Column(name = "nu_cpf", unique = true, nullable = false)
    private String cpf;
}
