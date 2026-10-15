package com.sistemaClinica.prontuario.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.dentista.repository.DentistaRepository;
import com.sistemaClinica.financeiro.model.LancamentoFinanceiro;
import com.sistemaClinica.financeiro.model.StatusLancamento;
import com.sistemaClinica.financeiro.model.TipoLancamento;
import com.sistemaClinica.financeiro.repository.LancamentoFinanceiroRepository;
import com.sistemaClinica.paciente.model.Paciente;
import com.sistemaClinica.paciente.repository.PacienteRepository;
import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.model.Procedimento;
import com.sistemaClinica.procedimento.repository.ProcedimentoRepository;
import com.sistemaClinica.prontuario.dto.ProntuarioDTO;
import com.sistemaClinica.prontuario.model.Prontuario;
import com.sistemaClinica.prontuario.repository.ProntuarioRepository;
import com.sistemaClinica.shared.ResourceNotFoundException;

@Service
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final ProcedimentoRepository procedimentoRepository;
    private final DentistaRepository dentistaRepository;
    private final LancamentoFinanceiroRepository lancamentoFinanceiroRepository;

    public ProntuarioService(
            ProntuarioRepository prontuarioRepository,
            PacienteRepository pacienteRepository,
            ProcedimentoRepository procedimentoRepository,
            DentistaRepository dentistaRepository,
            LancamentoFinanceiroRepository lancamentoFinanceiroRepository
    ) {
        this.prontuarioRepository = prontuarioRepository;
        this.pacienteRepository = pacienteRepository;
        this.procedimentoRepository = procedimentoRepository;
        this.dentistaRepository = dentistaRepository;
        this.lancamentoFinanceiroRepository = lancamentoFinanceiroRepository;
    }

    public List<ProntuarioDTO> listarPorPaciente(Integer pacienteId) {
        return prontuarioRepository.findByPacienteIdPacienteOrderByDataRealizacaoDesc(pacienteId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ProntuarioDTO salvar(ProntuarioDTO dto) {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado"));

        Procedimento procedimento = null;
        if (dto.getProcedimentoId() != null) {
            procedimento = procedimentoRepository.findById(dto.getProcedimentoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Procedimento nao encontrado"));
        }

        Dentista dentista = null;
        if (dto.getDentistaId() != null) {
            dentista = dentistaRepository.findById(dto.getDentistaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dentista nao encontrado"));
        }

        Prontuario prontuario = new Prontuario();
        prontuario.setPaciente(paciente);
        prontuario.setTitulo(dto.getTitulo());
        prontuario.setDentista(dentista);
        prontuario.setProcedimento(procedimento);
        prontuario.setDataRealizacao(dto.getDataRealizacao());
        prontuario.setObservacoes(dto.getObservacoes());

        Prontuario salvo = prontuarioRepository.save(prontuario);

        // Gera pendência financeira automaticamente se houver procedimento com valor
        if (procedimento != null && procedimento.getValor() != null
                && procedimento.getValor().compareTo(BigDecimal.ZERO) > 0) {
            LancamentoFinanceiro lancamento = new LancamentoFinanceiro();
            lancamento.setTipo(TipoLancamento.RECEITA);
            String descricao = procedimento.getNome() + " - " + paciente.getNome();
            lancamento.setDescricao(descricao);
            lancamento.setValor(procedimento.getValor());
            lancamento.setData(dto.getDataRealizacao() != null ? dto.getDataRealizacao() : LocalDate.now());
            lancamento.setStatus(StatusLancamento.PENDENTE);
            lancamento.setPaciente(paciente);
            lancamento.setObservacoes("Gerado automaticamente a partir do prontuario #" + salvo.getIdProntuario());
            lancamentoFinanceiroRepository.save(lancamento);
        }

        return toDto(salvo);
    }

    public void deletar(Integer id) {
        if (!prontuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prontuario nao encontrado");
        }
        prontuarioRepository.deleteById(id);
    }

    private ProntuarioDTO toDto(Prontuario prontuario) {
        ProntuarioDTO dto = new ProntuarioDTO();
        dto.setIdProntuario(prontuario.getIdProntuario());
        dto.setPacienteId(prontuario.getPaciente().getIdPaciente());
        dto.setNomePaciente(prontuario.getPaciente().getNome());
        dto.setTitulo(prontuario.getTitulo());
        dto.setDataRealizacao(prontuario.getDataRealizacao());
        dto.setObservacoes(prontuario.getObservacoes());

        if (prontuario.getDentista() != null) {
            dto.setDentistaId(prontuario.getDentista().getIdDentista());
            dto.setDentistaNome(prontuario.getDentista().getNome());
        }

        if (prontuario.getProcedimento() != null) {
            dto.setProcedimentoId(prontuario.getProcedimento().getIdProcedimento());
            ProcedimentoDTO procedimentoDTO = new ProcedimentoDTO();
            procedimentoDTO.setIdProcedimento(prontuario.getProcedimento().getIdProcedimento());
            procedimentoDTO.setNome(prontuario.getProcedimento().getNome());
            procedimentoDTO.setDescricao(prontuario.getProcedimento().getDescricao());
            procedimentoDTO.setValor(prontuario.getProcedimento().getValor());
            dto.setProcedimento(procedimentoDTO);
        }

        return dto;
    }
}
