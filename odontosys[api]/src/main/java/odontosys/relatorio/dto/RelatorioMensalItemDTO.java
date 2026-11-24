package com.sistemaClinica.relatorio.dto;

import java.math.BigDecimal;

public record RelatorioMensalItemDTO(int mes, int ano, long totalConsultas, BigDecimal faturamento) {}
