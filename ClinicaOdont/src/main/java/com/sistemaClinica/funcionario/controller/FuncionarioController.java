package com.sistemaClinica.funcionario.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {


    @GetMapping
    public void pegaInfoFuncionarios(Integer idFuncionario, String nmFuncionario, Integer nuMatricula) {
        System.out.println("ID do Funcionário: " + idFuncionario);
        System.out.println("Nome do Funcionário: " + nmFuncionario);
        System.out.println("Número de Matrícula: " + nuMatricula);


    }
}
