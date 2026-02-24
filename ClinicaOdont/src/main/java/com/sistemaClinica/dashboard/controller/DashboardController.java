package com.sistemaClinica.dashboard.controller;

import com.sistemaClinica.dashboard.dto.DashboardResumoDTO;
import com.sistemaClinica.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumo")
    public DashboardResumoDTO resumo() {
        return dashboardService.resumo();
    }
}
