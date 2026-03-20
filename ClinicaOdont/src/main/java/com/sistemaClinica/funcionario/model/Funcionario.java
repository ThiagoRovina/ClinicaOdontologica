package com.sistemaClinica.funcionario.model;

import jakarta.persistence.*;
import lombok.Generated;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "FUNCIONARIOS")
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id_funcionario")
    public Integer idFuncionario;

    @Column(name= "nm_funcionario", nullable = false)
    public String nmFuncionario;

    @Column(name= "nu_matricula", unique = true, nullable = false)
    public int nuMatricula;

    @Column(name = "ds_cargo", nullable = false)
    @Enumerated(EnumType.STRING)
    public TipoFuncionario cargo;

    @Column(name = "dt_admissao", nullable = false)
    public LocalDate dataAdmissao;

    @Column(name = "ds_email", unique = true, nullable = false)
    public String email;

    @Column(name = "nu_telefone")
    public String telefone;
}
