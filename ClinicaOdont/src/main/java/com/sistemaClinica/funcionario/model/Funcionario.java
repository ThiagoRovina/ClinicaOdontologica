package com.sistemaClinica.funcionario.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "FUNCIONARIOS")
public class Funcionario {
    @Id
    @Column(name= "id_funcionario")
    public String idFuncionario;

    @Column(name= "nm_funcionario", nullable = false)
    public String nmFuncionario;

    @Column(name= "nu_matricula", unique = true, nullable = false)
    public int nuMatricula;

    @Enumerated(EnumType.STRING)
    @Column(name = "ds_cargo", nullable = false)
    public TipoFuncionario cargo;

    @Column(name = "dt_admissao", nullable = false)
    public LocalDate dataAdmissao;

    @Column(name = "ds_email", unique = true, nullable = false)
    public String email;

    @Column(name = "nu_telefone")
    public String telefone;
}
