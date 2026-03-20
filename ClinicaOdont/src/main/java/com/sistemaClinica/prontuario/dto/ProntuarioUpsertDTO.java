package com.sistemaClinica.prontuario.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProntuarioUpsertDTO {
    private String titulo;
    private Integer idPaciente;
    private Integer idDentista;
    private Integer idProcedimento;
    private LocalDate dataRealizacao;
    private String observacoes;
}
