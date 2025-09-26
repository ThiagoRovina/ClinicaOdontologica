package com.sistemaClinica.paciente.repository;

import com.sistemaClinica.paciente.model.Paciente;

import java.util.HashMap;
import java.util.Map;

public class PacienteRepository {

    public final Map<Long, Paciente> banco = new HashMap<>();

    public Paciente salvar(Paciente paciente) {

        return paciente;
    }
}
