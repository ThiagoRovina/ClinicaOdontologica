package com.sistemaClinica.consulta.dto;

import com.sistemaClinica.consulta.model.StatusConsulta;
import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.paciente.dto.PacienteDTO;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ConsultaDTO {
    private String idConsulta;
    private PacienteDTO paciente;
    private DentistaDTO dentista;
    private LocalDateTime dataHora;
    private StatusConsulta status;
    private String observacoes;
}
