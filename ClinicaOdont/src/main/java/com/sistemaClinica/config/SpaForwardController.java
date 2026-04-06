package com.sistemaClinica.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping({
            "/",
            "/telaLogin",
            "/registrar",
            "/Home",
            "/pacientes",
            "/pacientes/novo",
            "/pacientes/editar/{id}",
            "/pacientes/{id}/prontuario",
            "/dentistas",
            "/dentistas/novo",
            "/dentistas/editar/{id}",
            "/funcionarios",
            "/funcionarios/novo",
            "/funcionarios/editar/{id}",
            "/agendamento",
            "/procedimentos",
            "/procedimentos/novo",
            "/procedimentos/editar/{id}",
            "/relatorios",
            "/consultas",
            "/consultas/hoje"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
