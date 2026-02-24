package com.sistemaClinica.dashboard.service;

import com.sistemaClinica.consulta.model.StatusConsulta;
import com.sistemaClinica.consulta.repository.ConsultaRepository;
import com.sistemaClinica.dashboard.dto.DashboardResumoDTO;
import com.sistemaClinica.dentista.repository.DentistaRepository;
import com.sistemaClinica.funcionario.repository.FuncionarioRepository;
import com.sistemaClinica.paciente.repository.PacienteRepository;
import com.sistemaClinica.procedimento.repository.ProcedimentoRepository;
import com.sistemaClinica.prontuario.repository.ProntuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DashboardService {

    private final PacienteRepository pacienteRepository;
    private final DentistaRepository dentistaRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final ProcedimentoRepository procedimentoRepository;
    private final ProntuarioRepository prontuarioRepository;
    private final ConsultaRepository consultaRepository;

    public DashboardService(
            PacienteRepository pacienteRepository,
            DentistaRepository dentistaRepository,
            FuncionarioRepository funcionarioRepository,
            ProcedimentoRepository procedimentoRepository,
            ProntuarioRepository prontuarioRepository,
            ConsultaRepository consultaRepository
    ) {
        this.pacienteRepository = pacienteRepository;
        this.dentistaRepository = dentistaRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.procedimentoRepository = procedimentoRepository;
        this.prontuarioRepository = prontuarioRepository;
        this.consultaRepository = consultaRepository;
    }

    public DashboardResumoDTO resumo() {
        DashboardResumoDTO dto = new DashboardResumoDTO();
        dto.setTotalPacientes(pacienteRepository.count());
        dto.setTotalDentistas(dentistaRepository.count());
        dto.setTotalFuncionarios(funcionarioRepository.count());
        dto.setTotalProcedimentos(procedimentoRepository.count());
        dto.setTotalProntuarios(prontuarioRepository.count());

        LocalDateTime inicio = LocalDate.now().atStartOfDay();
        LocalDateTime fim = LocalDate.now().atTime(23, 59, 59);
        dto.setConsultasHoje(consultaRepository.countByDataHoraBetween(inicio, fim));
        dto.setConsultasAgendadasHoje(consultaRepository.countByDataHoraBetweenAndStatus(inicio, fim, StatusConsulta.AGENDADA));
        return dto;
    }
}
