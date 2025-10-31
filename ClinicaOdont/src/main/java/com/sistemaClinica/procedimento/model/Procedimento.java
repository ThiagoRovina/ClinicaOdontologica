package com.sistemaClinica.procedimento.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "PROCEDIMENTOS")
public class Procedimento {

    @Id
    @Column(name = "id_procedimento")
    private String idProcedimento;

    @Column(name = "nm_procedimento", nullable = false)
    private String nome;

    @Column(name = "ds_procedimento")
    private String descricao;

    @Column(name = "vl_procedimento", nullable = false)
    private BigDecimal valor;
}
