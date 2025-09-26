package com.sistemaClinica.paciente.service;
import com.sistemaClinica.paciente.model.Paciente;
import com.sistemaClinica.paciente.repository.PacienteRepository;

public class PacienteService {
    private final PacienteRepository repository;


    public PacienteService(PacienteRepository repository) {
        this.repository = repository;
    }

    public Paciente cadastrarFuncionario(Paciente paciente) {
        return repository.salvar(paciente);
    }
}
