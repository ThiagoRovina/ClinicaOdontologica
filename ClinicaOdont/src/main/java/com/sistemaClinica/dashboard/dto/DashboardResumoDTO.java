package com.sistemaClinica.dashboard.dto;

import lombok.Data;

@Data
public class DashboardResumoDTO {
    private long totalPacientes;
    private long totalDentistas;
    private long totalFuncionarios;
    private long totalProcedimentos;
    private long totalProntuarios;
    private long consultasHoje;
    private long consultasAgendadasHoje;
}
