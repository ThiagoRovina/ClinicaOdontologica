package com.sistemaClinica.prontuario.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProntuarioUpsertDTO {
    private String titulo;
    private String idPaciente;
    private String idDentista;
    private String idProcedimento;
    private LocalDate dataRealizacao;
    private String observacoes;
}
