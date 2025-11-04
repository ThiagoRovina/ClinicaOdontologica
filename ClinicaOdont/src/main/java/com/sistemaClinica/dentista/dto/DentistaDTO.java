package com.sistemaClinica.dentista.dto;

import lombok.Data;

@Data
public class DentistaDTO {
    private String idDentista;
    private String nome;
    private String especializacao;
    private String cro;
    private String email;
    private String telefone;
}
