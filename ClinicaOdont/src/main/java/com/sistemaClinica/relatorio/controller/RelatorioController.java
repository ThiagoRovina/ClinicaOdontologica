package com.sistemaClinica.relatorio.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sistemaClinica.consulta.model.StatusConsulta;
import com.sistemaClinica.consulta.repository.ConsultaRepository;
import com.sistemaClinica.prontuario.repository.ProntuarioRepository;
import com.sistemaClinica.relatorio.dto.RelatorioResumoDTO;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final ConsultaRepository consultaRepository;
    private final ProntuarioRepository prontuarioRepository;

    public RelatorioController(ConsultaRepository consultaRepository, ProntuarioRepository prontuarioRepository) {
        this.consultaRepository = consultaRepository;
        this.prontuarioRepository = prontuarioRepository;
    }

    @GetMapping("/resumo")
    public RelatorioResumoDTO resumo(
            @RequestParam(required = false) LocalDate dataInicio,
            @RequestParam(required = false) LocalDate dataFim
    ) {
        LocalDate inicio = dataInicio != null ? dataInicio : LocalDate.now().minusDays(30);
        LocalDate fim = dataFim != null ? dataFim : LocalDate.now();

        LocalDateTime inicioDateTime = inicio.atStartOfDay();
        LocalDateTime fimDateTime = fim.atTime(23, 59, 59);
        long totalConsultas = consultaRepository.countByDataHoraBetween(inicioDateTime, fimDateTime);
        long consultasAgendadas = consultaRepository.countByDataHoraBetweenAndStatus(inicioDateTime, fimDateTime, StatusConsulta.AGENDADA);
        long consultasCanceladas = consultaRepository.countByDataHoraBetweenAndStatus(inicioDateTime, fimDateTime, StatusConsulta.CANCELADA);
        long procedimentosRealizados = prontuarioRepository.countByDataRealizacaoBetween(inicio, fim);
        BigDecimal faturamentoEstimado = prontuarioRepository.somarValorTotalPorPeriodo(inicio, fim);

        return new RelatorioResumoDTO(
                inicio,
                fim,
                totalConsultas,
                consultasAgendadas,
                consultasCanceladas,
                procedimentosRealizados,
                faturamentoEstimado
        );
    }
}
