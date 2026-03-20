package com.sistemaClinica.dashboard.dto;

public record DashboardSummaryDTO(
        long totalPacientes,
        long totalDentistas,
        long totalFuncionarios,
        long consultasHoje,
        long consultasAgendadas,
        long consultasCanceladas
) {
}
