package com.sistemaClinica.funcionario.service;
import com.sistemaClinica.funcionario.model.Funcionario;
import com.sistemaClinica.funcionario.repository.FuncionarioRepository;
import java.util.List;
public class FuncionarioService {
    private final FuncionarioRepository repository;


    public FuncionarioService(FuncionarioRepository repository) {
        this.repository = repository;
    }

    public Funcionario cadastrarFuncionario(Funcionario funcionario) {
        return repository.salvar(funcionario);
    }
}
