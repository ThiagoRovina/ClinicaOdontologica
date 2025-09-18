package com.sistemaClinica.funcionario.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "FUNCIONARIOS")
public class Funcionario {
    @Id
    @Column(name= "id_funcionario")
    public String idFuncionario;

    @Column(name= "nm_funcionario")
    public String nmFuncionario;

    @Column(name= "nu_matricula")
    public int nuMatricula;
}
