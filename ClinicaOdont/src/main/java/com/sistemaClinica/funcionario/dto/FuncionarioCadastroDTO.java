package com.sistemaClinica.funcionario.dto;

import com.sistemaClinica.funcionario.model.TipoFuncionario;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FuncionarioCadastroDTO {
    private String idFuncionario;
    private String nmFuncionario;
    private int nuMatricula;
    private TipoFuncionario cargo;
    private LocalDate dataAdmissao;
    private String email;
    private String telefone;
    private String senha; // Campo extra para a senha
}
