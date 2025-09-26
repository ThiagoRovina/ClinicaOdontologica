package com.sistemaClinica.paciente.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "PACIENTE")
public class Paciente {
    @Id
    @Column(name= "ID_PACIENTE")
    public String idPaciente;

    @Column(name= "NM_PACIENTE")
    public String nmPaciente;

    @Column(name= "NM_ENDERECO")
    public String nmEndereco;

    @Column(name= "CPFCNPJ_PACIENTE")
    public String cpfCnpjPaciente;




}
