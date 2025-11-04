package com.sistemaClinica.funcionario.model;


public enum TipoFuncionario {
    DENTISTA(0),
    ADMINISTRATIVO(1),
    GERENTE(2);

    private final Integer valor;

    TipoFuncionario(Integer i) { this.valor = i; }

    TipoFuncionario(int i, Integer valor) {
        this.valor = valor;
    }

    public static TipoFuncionario getTipoFuncionario(String tipo) {
        switch (tipo) {
            case "DENTISTA":
                return TipoFuncionario.DENTISTA;
            case "ADMINISTRATIVO":
                return TipoFuncionario.ADMINISTRATIVO;
            case "GERENTE":
                return TipoFuncionario.GERENTE;
            default:
                return null;
        }
    }
    public static TipoFuncionario getTipoFuncionarioInt(Integer tipo) {
        switch (tipo) {
            case 0:
                return TipoFuncionario.DENTISTA;
            case 1:
                return TipoFuncionario.ADMINISTRATIVO;
            case 2:
                return TipoFuncionario.GERENTE;
            default:
                return null;
        }
    }
}
