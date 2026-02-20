package com.sistemaClinica.procedimento.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "PROCEDIMENTOS")
public class Procedimento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_procedimento")
    private String idProcedimento;

    @Column(name = "nm_procedimento", nullable = false)
    private String nome;

    @Column(name = "ds_procedimento")
    private String descricao;

    @Column(name = "vl_procedimento", nullable = false)
    private BigDecimal valor;
}
