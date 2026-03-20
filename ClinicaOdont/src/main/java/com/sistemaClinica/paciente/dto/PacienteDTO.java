package com.sistemaClinica.paciente.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PacienteDTO {

    private Integer idPaciente;
    @NotBlank(message = "Nome do paciente e obrigatorio")
    private String nome;
    @NotNull(message = "Data de nascimento e obrigatoria")
    private LocalDate dataNascimento;
    private String endereco;
    @NotBlank(message = "Telefone e obrigatorio")
    private String telefone;
    @Email(message = "Email invalido")
    private String email;
    @NotBlank(message = "CPF e obrigatorio")
    private String cpf;
}
