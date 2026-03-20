package com.sistemaClinica.financeiro.service;

import com.sistemaClinica.consulta.repository.ConsultaRepository;
import com.sistemaClinica.financeiro.dto.LancamentoFinanceiroDTO;
import com.sistemaClinica.financeiro.model.LancamentoFinanceiro;
import com.sistemaClinica.financeiro.repository.LancamentoFinanceiroRepository;
import com.sistemaClinica.paciente.repository.PacienteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinanceiroService {

    private final LancamentoFinanceiroRepository lancamentoRepository;
    private final PacienteRepository pacienteRepository;
    private final ConsultaRepository consultaRepository;

    public FinanceiroService(
            LancamentoFinanceiroRepository lancamentoRepository,
            PacienteRepository pacienteRepository,
            ConsultaRepository consultaRepository
    ) {
        this.lancamentoRepository = lancamentoRepository;
        this.pacienteRepository = pacienteRepository;
        this.consultaRepository = consultaRepository;
    }

    public List<LancamentoFinanceiroDTO> listar(LocalDate from, LocalDate to) {
        List<LancamentoFinanceiro> lancamentos;
        if (from != null && to != null) {
            lancamentos = lancamentoRepository.findByDataBetweenOrderByDataDesc(from, to);
        } else {
            lancamentos = lancamentoRepository.findAll();
        }
        return lancamentos.stream().map(this::toDto).collect(Collectors.toList());
    }

    public LancamentoFinanceiroDTO buscarPorId(String id) {
        return lancamentoRepository.findById(id).map(this::toDto).orElse(null);
    }

    public LancamentoFinanceiroDTO criar(LancamentoFinanceiroDTO dto) {
        LancamentoFinanceiro lancamento = new LancamentoFinanceiro();
        aplicarDto(lancamento, dto);
        return toDto(lancamentoRepository.save(lancamento));
    }

    public LancamentoFinanceiroDTO atualizar(String id, LancamentoFinanceiroDTO dto) {
        LancamentoFinanceiro lancamento = lancamentoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lancamento nao encontrado: " + id));
        aplicarDto(lancamento, dto);
        return toDto(lancamentoRepository.save(lancamento));
    }

    public void deletar(String id) {
        lancamentoRepository.deleteById(id);
    }

    private void aplicarDto(LancamentoFinanceiro lancamento, LancamentoFinanceiroDTO dto) {
        lancamento.setTipo(dto.getTipo());
        lancamento.setDescricao(dto.getDescricao());
        lancamento.setValor(dto.getValor());
        lancamento.setData(dto.getData());
        lancamento.setStatus(dto.getStatus());
        lancamento.setObservacoes(dto.getObservacoes());

        if (dto.getIdPaciente() != null && !dto.getIdPaciente().isBlank()) {
            lancamento.setPaciente(pacienteRepository.findById(dto.getIdPaciente())
                    .orElseThrow(() -> new IllegalArgumentException("Paciente nao encontrado: " + dto.getIdPaciente())));
        } else {
            lancamento.setPaciente(null);
        }

        if (dto.getIdConsulta() != null && !dto.getIdConsulta().isBlank()) {
            lancamento.setConsulta(consultaRepository.findById(dto.getIdConsulta())
                    .orElseThrow(() -> new IllegalArgumentException("Consulta nao encontrada: " + dto.getIdConsulta())));
        } else {
            lancamento.setConsulta(null);
        }
    }

    private LancamentoFinanceiroDTO toDto(LancamentoFinanceiro lancamento) {
        LancamentoFinanceiroDTO dto = new LancamentoFinanceiroDTO();
        dto.setIdLancamento(lancamento.getIdLancamento());
        dto.setTipo(lancamento.getTipo());
        dto.setDescricao(lancamento.getDescricao());
        dto.setValor(lancamento.getValor());
        dto.setData(lancamento.getData());
        dto.setStatus(lancamento.getStatus());
        dto.setObservacoes(lancamento.getObservacoes());
        dto.setIdPaciente(lancamento.getPaciente() != null ? lancamento.getPaciente().getIdPaciente() : null);
        dto.setIdConsulta(lancamento.getConsulta() != null ? lancamento.getConsulta().getIdConsulta() : null);
        return dto;
    }
}
