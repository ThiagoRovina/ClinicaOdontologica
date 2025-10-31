package com.sistemaClinica.funcionario.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FuncionarioDTO {

    private String idFuncionario;
    private String nmFuncionario;
    private int nuMatricula;
    private String cargo;
    private LocalDate dataAdmissao;
    private String email;
    private String telefone;
}
