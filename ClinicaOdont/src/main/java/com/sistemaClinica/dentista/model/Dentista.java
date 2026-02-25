package com.sistemaClinica.dentista.model;

import com.sistemaClinica.funcionario.model.Funcionario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "DENTISTAS")
public class Dentista {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_dentista")
    private String idDentista;

    @Column(name = "nm_dentista", nullable = false)
    private String nome;

    @Column(name = "ds_especializacao", nullable = false)
    private String especializacao;

    @Column(name = "nu_cro", unique = true, nullable = false)
    private String cro;

    @Column(name = "ds_email", unique = true)
    private String email;

    @Column(name = "nu_telefone")
    private String telefone;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_funcionario", unique = true)
    private Funcionario funcionario;
}
