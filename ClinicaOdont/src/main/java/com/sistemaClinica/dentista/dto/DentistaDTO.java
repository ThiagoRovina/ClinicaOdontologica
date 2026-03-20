package com.sistemaClinica.dentista.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DentistaDTO {
    private Integer idDentista;
    @NotBlank(message = "Nome do dentista e obrigatorio")
    private String nome;
    @NotBlank(message = "Especializacao e obrigatoria")
    private String especializacao;
    @NotBlank(message = "CRO e obrigatorio")
    private String cro;
    @Email(message = "Email invalido")
    private String email;
    private String telefone;
    private Integer idFuncionario;
}
