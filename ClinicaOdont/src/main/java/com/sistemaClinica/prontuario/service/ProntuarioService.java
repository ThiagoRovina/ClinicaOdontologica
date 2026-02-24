package com.sistemaClinica.prontuario.service;

import com.sistemaClinica.dentista.mapper.DentistaMapper;
import com.sistemaClinica.dentista.repository.DentistaRepository;
import com.sistemaClinica.paciente.mapper.PacienteMapper;
import com.sistemaClinica.paciente.repository.PacienteRepository;
import com.sistemaClinica.procedimento.mapper.ProcedimentoMapper;
import com.sistemaClinica.procedimento.repository.ProcedimentoRepository;
import com.sistemaClinica.prontuario.dto.ProntuarioDTO;
import com.sistemaClinica.prontuario.dto.ProntuarioUpsertDTO;
import com.sistemaClinica.prontuario.model.Prontuario;
import com.sistemaClinica.prontuario.repository.ProntuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final DentistaRepository dentistaRepository;
    private final ProcedimentoRepository procedimentoRepository;
    private final PacienteMapper pacienteMapper;
    private final DentistaMapper dentistaMapper;
    private final ProcedimentoMapper procedimentoMapper;

    public ProntuarioService(
            ProntuarioRepository prontuarioRepository,
            PacienteRepository pacienteRepository,
            DentistaRepository dentistaRepository,
            ProcedimentoRepository procedimentoRepository,
            PacienteMapper pacienteMapper,
            DentistaMapper dentistaMapper,
            ProcedimentoMapper procedimentoMapper
    ) {
        this.prontuarioRepository = prontuarioRepository;
        this.pacienteRepository = pacienteRepository;
        this.dentistaRepository = dentistaRepository;
        this.procedimentoRepository = procedimentoRepository;
        this.pacienteMapper = pacienteMapper;
        this.dentistaMapper = dentistaMapper;
        this.procedimentoMapper = procedimentoMapper;
    }

    public List<ProntuarioDTO> listarTodos() {
        return prontuarioRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProntuarioDTO> listarPorPaciente(String idPaciente) {
        return prontuarioRepository.findByPaciente_IdPacienteOrderByDataRealizacaoDesc(idPaciente).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProntuarioDTO buscarPorId(String id) {
        return prontuarioRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    public ProntuarioDTO criar(ProntuarioUpsertDTO dto) {
        Prontuario prontuario = new Prontuario();
        aplicarUpsert(prontuario, dto);
        return toDto(prontuarioRepository.save(prontuario));
    }

    public ProntuarioDTO atualizar(String id, ProntuarioUpsertDTO dto) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuario nao encontrado: " + id));
        aplicarUpsert(prontuario, dto);
        return toDto(prontuarioRepository.save(prontuario));
    }

    public void deletar(String id) {
        prontuarioRepository.deleteById(id);
    }

    private void aplicarUpsert(Prontuario prontuario, ProntuarioUpsertDTO dto) {
        prontuario.setTitulo(dto.getTitulo());
        prontuario.setObservacoes(dto.getObservacoes());
        prontuario.setDataRealizacao(dto.getDataRealizacao());

        if (dto.getIdPaciente() == null || dto.getIdPaciente().isBlank()) {
            throw new IllegalArgumentException("idPaciente e obrigatorio");
        }
        prontuario.setPaciente(pacienteRepository.findById(dto.getIdPaciente())
                .orElseThrow(() -> new IllegalArgumentException("Paciente nao encontrado: " + dto.getIdPaciente())));

        if (dto.getIdDentista() != null && !dto.getIdDentista().isBlank()) {
            prontuario.setDentista(dentistaRepository.findById(dto.getIdDentista())
                    .orElseThrow(() -> new IllegalArgumentException("Dentista nao encontrado: " + dto.getIdDentista())));
        } else {
            prontuario.setDentista(null);
        }

        if (dto.getIdProcedimento() != null && !dto.getIdProcedimento().isBlank()) {
            prontuario.setProcedimento(procedimentoRepository.findById(dto.getIdProcedimento())
                    .orElseThrow(() -> new IllegalArgumentException("Procedimento nao encontrado: " + dto.getIdProcedimento())));
        } else {
            prontuario.setProcedimento(null);
        }
    }

    private ProntuarioDTO toDto(Prontuario prontuario) {
        ProntuarioDTO dto = new ProntuarioDTO();
        dto.setIdProntuario(prontuario.getIdProntuario());
        dto.setTitulo(prontuario.getTitulo());
        dto.setPaciente(pacienteMapper.toDto(prontuario.getPaciente()));
        dto.setDentista(dentistaMapper.toDto(prontuario.getDentista()));
        dto.setProcedimento(procedimentoMapper.toDto(prontuario.getProcedimento()));
        dto.setDataRealizacao(prontuario.getDataRealizacao());
        dto.setObservacoes(prontuario.getObservacoes());
        return dto;
    }
}
