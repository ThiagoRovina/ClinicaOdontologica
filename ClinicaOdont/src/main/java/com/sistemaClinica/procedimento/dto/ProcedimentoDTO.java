package com.sistemaClinica.procedimento.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProcedimentoDTO {
    private String idProcedimento;
    private String nome;
    private String descricao;
    private BigDecimal valor;
}
