package com.sistemaClinica.relatorio.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RelatorioResumoDTO(
        LocalDate dataInicio,
        LocalDate dataFim,
        long totalConsultas,
        long consultasAgendadas,
        long consultasCanceladas,
        long procedimentosRealizados,
        BigDecimal faturamentoEstimado
) {
}
