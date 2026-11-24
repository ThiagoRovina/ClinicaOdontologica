package com.sistemaClinica.listaespera.dto;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.listaespera.model.StatusListaEspera;
import com.sistemaClinica.paciente.dto.PacienteDTO;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class ListaEsperaDTO {
    private String idListaEspera;
    private PacienteDTO paciente;
    private DentistaDTO dentista;
    private LocalDate dataPreferida;
    private LocalTime horarioInicioPreferido;
    private LocalTime horarioFimPreferido;
    private StatusListaEspera status;
    private LocalDateTime dataSolicitacao;
    private String observacoes;
}
