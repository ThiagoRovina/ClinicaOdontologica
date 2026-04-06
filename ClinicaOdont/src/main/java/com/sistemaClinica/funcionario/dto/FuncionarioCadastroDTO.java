package com.sistemaClinica.funcionario.dto;

import com.sistemaClinica.funcionario.model.TipoFuncionario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FuncionarioCadastroDTO {
    private Integer idFuncionario;
    @NotBlank(message = "Nome do funcionario e obrigatorio")
    private String nmFuncionario;
    private int nuMatricula;
    @NotNull(message = "Cargo e obrigatorio")
    private TipoFuncionario cargo;
    @NotNull(message = "Data de admissao e obrigatoria")
    private LocalDate dataAdmissao;
    @Email(message = "Email invalido")
    @NotBlank(message = "Email e obrigatorio")
    private String email;
    private String telefone;
    @NotBlank(message = "Senha e obrigatoria")
    private String senha;
}
