package com.sistemaClinica.consulta.dto;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.consulta.model.StatusConsulta;
import com.sistemaClinica.paciente.dto.PacienteDTO;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ConsultaDTO {
    private Integer idConsulta;
    @NotNull(message = "Paciente e obrigatorio")
    private PacienteDTO paciente;
    @NotNull(message = "Dentista e obrigatorio")
    private DentistaDTO dentista;
    @NotNull(message = "Data e hora da consulta sao obrigatorias")
    private LocalDateTime dataHora;
    private StatusConsulta status;
    private String observacoes;
}
