package com.sistemaClinica.prontuario.dto;

import java.time.LocalDate;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProntuarioDTO {
    private Integer idProntuario;

    @NotNull(message = "Paciente e obrigatorio")
    private Integer pacienteId;

    @NotNull(message = "Procedimento e obrigatorio")
    private Integer procedimentoId;

    @NotNull(message = "Data de realizacao e obrigatoria")
    private LocalDate dataRealizacao;

    private String observacoes;
    private String nomePaciente;
    private ProcedimentoDTO procedimento;
}
