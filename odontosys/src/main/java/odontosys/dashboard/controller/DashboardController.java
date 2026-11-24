package com.sistemaClinica.dashboard.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemaClinica.consulta.model.StatusConsulta;
import com.sistemaClinica.consulta.repository.ConsultaRepository;
import com.sistemaClinica.dashboard.dto.DashboardSummaryDTO;
import com.sistemaClinica.dentista.repository.DentistaRepository;
import com.sistemaClinica.funcionario.repository.FuncionarioRepository;
import com.sistemaClinica.paciente.repository.PacienteRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final PacienteRepository pacienteRepository;
    private final DentistaRepository dentistaRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final ConsultaRepository consultaRepository;

    public DashboardController(
            PacienteRepository pacienteRepository,
            DentistaRepository dentistaRepository,
            FuncionarioRepository funcionarioRepository,
            ConsultaRepository consultaRepository
    ) {
        this.pacienteRepository = pacienteRepository;
        this.dentistaRepository = dentistaRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.consultaRepository = consultaRepository;
    }

    @GetMapping("/summary")
    public DashboardSummaryDTO getSummary() {
        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();
        LocalDateTime fimDoDia = LocalDate.now().atTime(23, 59, 59);

        return new DashboardSummaryDTO(
                pacienteRepository.count(),
                dentistaRepository.count(),
                funcionarioRepository.count(),
                consultaRepository.countByDataHoraBetween(inicioDoDia, fimDoDia),
                consultaRepository.countByStatus(StatusConsulta.AGENDADA),
                consultaRepository.countByStatus(StatusConsulta.CANCELADA)
        );
    }
}
