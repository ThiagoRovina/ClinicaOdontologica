package com.sistemaClinica.prontuario.dto;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProntuarioDTO {
    private String idProntuario;
    private String titulo;
    private PacienteDTO paciente;
    private DentistaDTO dentista;
    private ProcedimentoDTO procedimento;
    private LocalDate dataRealizacao;
    private String observacoes;
}
