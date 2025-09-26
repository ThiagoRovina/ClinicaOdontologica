package com.sistemaClinica.paciente.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pacientes")
public class PacienteController {


    @GetMapping
    public void pegaInfoPaciente(Integer idPaciente, String nmPaciente, Integer nuPaciente) {
        System.out.println("ID do Funcionário: " + idPaciente);
        System.out.println("Nome do Funcionário: " + nmPaciente);
        System.out.println("Número de Matrícula: " + nuPaciente);


    }
}
