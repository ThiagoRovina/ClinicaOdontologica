package com.sistemaClinica.procedimento.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProcedimentoDTO {
    private Integer idProcedimento;

    @NotBlank(message = "Nome do procedimento e obrigatorio")
    private String nome;

    private String descricao;

    @NotNull(message = "Valor do procedimento e obrigatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "Valor deve ser maior que zero")
    private BigDecimal valor;
}
