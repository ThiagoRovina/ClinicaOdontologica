package com.sistemaClinica.financeiro.dto;

import com.sistemaClinica.financeiro.model.StatusLancamento;
import com.sistemaClinica.financeiro.model.TipoLancamento;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class LancamentoFinanceiroDTO {
    private String idLancamento;
    private TipoLancamento tipo;
    private String descricao;
    private BigDecimal valor;
    private LocalDate data;
    private StatusLancamento status;
    private String idPaciente;
    private String idConsulta;
    private String observacoes;
}
