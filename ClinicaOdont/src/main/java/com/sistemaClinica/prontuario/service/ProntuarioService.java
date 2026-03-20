package com.sistemaClinica.prontuario.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sistemaClinica.paciente.model.Paciente;
import com.sistemaClinica.paciente.repository.PacienteRepository;
import com.sistemaClinica.prontuario.dto.ProntuarioDTO;
import com.sistemaClinica.prontuario.model.Prontuario;
import com.sistemaClinica.prontuario.repository.ProntuarioRepository;
import com.sistemaClinica.procedimento.model.Procedimento;
import com.sistemaClinica.procedimento.repository.ProcedimentoRepository;
import com.sistemaClinica.shared.ResourceNotFoundException;

@Service
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final ProcedimentoRepository procedimentoRepository;

    public ProntuarioService(
            ProntuarioRepository prontuarioRepository,
            PacienteRepository pacienteRepository,
            ProcedimentoRepository procedimentoRepository
    ) {
        this.prontuarioRepository = prontuarioRepository;
        this.pacienteRepository = pacienteRepository;
        this.procedimentoRepository = procedimentoRepository;
    }

    public List<ProntuarioDTO> listarPorPaciente(Integer pacienteId) {
        return prontuarioRepository.findByPacienteIdPacienteOrderByDataRealizacaoDesc(pacienteId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ProntuarioDTO salvar(ProntuarioDTO prontuarioDTO) {
        Paciente paciente = pacienteRepository.findById(prontuarioDTO.getPacienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado"));

        Procedimento procedimento = procedimentoRepository.findById(prontuarioDTO.getProcedimentoId())
                .orElseThrow(() -> new ResourceNotFoundException("Procedimento nao encontrado"));

        Prontuario prontuario = new Prontuario();
        prontuario.setPaciente(paciente);
        prontuario.setProcedimento(procedimento);
        prontuario.setDataRealizacao(prontuarioDTO.getDataRealizacao());
        prontuario.setObservacoes(prontuarioDTO.getObservacoes());

        return toDto(prontuarioRepository.save(prontuario));
    }

    private ProntuarioDTO toDto(Prontuario prontuario) {
        ProntuarioDTO dto = new ProntuarioDTO();
        dto.setIdProntuario(prontuario.getIdProntuario());
        dto.setPacienteId(prontuario.getPaciente().getIdPaciente());
        dto.setNomePaciente(prontuario.getPaciente().getNome());
        dto.setProcedimentoId(prontuario.getProcedimento().getIdProcedimento());
        dto.setDataRealizacao(prontuario.getDataRealizacao());
        dto.setObservacoes(prontuario.getObservacoes());

        com.sistemaClinica.procedimento.dto.ProcedimentoDTO procedimentoDTO = new com.sistemaClinica.procedimento.dto.ProcedimentoDTO();
        procedimentoDTO.setIdProcedimento(prontuario.getProcedimento().getIdProcedimento());
        procedimentoDTO.setNome(prontuario.getProcedimento().getNome());
        procedimentoDTO.setDescricao(prontuario.getProcedimento().getDescricao());
        procedimentoDTO.setValor(prontuario.getProcedimento().getValor());
        dto.setProcedimento(procedimentoDTO);
        return dto;
    }
}
