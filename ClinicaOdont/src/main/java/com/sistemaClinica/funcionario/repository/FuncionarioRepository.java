package com.sistemaClinica.funcionario.repository;

import com.sistemaClinica.funcionario.model.Funcionario;

import java.util.HashMap;
import java.util.Map;

public class FuncionarioRepository {

    public final Map<Long, Funcionario> banco = new HashMap<>();

    public Funcionario salvar(Funcionario funcionario) {
        banco.put((long) funcionario.getNuMatricula(), funcionario);
        return funcionario;
    }
}
