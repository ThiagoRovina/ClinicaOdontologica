package com.sistemaClinica.paciente.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PacienteDTO {

    private String idPaciente;
    private String nome;
    private LocalDate dataNascimento;
    private String endereco;
    private String telefone;
    private String email;
    private String cpf;
}
