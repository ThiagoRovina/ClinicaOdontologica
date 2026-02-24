package com.sistemaClinica.financeiro.model;

import com.sistemaClinica.consulta.model.Consulta;
import com.sistemaClinica.paciente.model.Paciente;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "LANCAMENTOS_FINANCEIROS")
public class LancamentoFinanceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_lancamento")
    private String idLancamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tp_lancamento", nullable = false)
    private TipoLancamento tipo;

    @Column(name = "ds_descricao", nullable = false, length = 500)
    private String descricao;

    @Column(name = "vl_valor", nullable = false)
    private BigDecimal valor;

    @Column(name = "dt_lancamento", nullable = false)
    private LocalDate data;

    @Enumerated(EnumType.STRING)
    @Column(name = "ds_status", nullable = false)
    private StatusLancamento status;

    @ManyToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_consulta")
    private Consulta consulta;

    @Column(name = "ds_observacoes", length = 2000)
    private String observacoes;

    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = StatusLancamento.PENDENTE;
        }
    }
}
