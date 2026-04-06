package com.sistemaClinica.funcionario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FuncionarioDTO {

    private Integer idFuncionario;
    @NotBlank(message = "Nome do funcionario e obrigatorio")
    private String nmFuncionario;
    private int nuMatricula;
    @NotBlank(message = "Cargo e obrigatorio")
    private String cargo;
    @NotNull(message = "Data de admissao e obrigatoria")
    private LocalDate dataAdmissao;
    @Email(message = "Email invalido")
    @NotBlank(message = "Email e obrigatorio")
    private String email;
    private String telefone;
    private String idDentista;
}
