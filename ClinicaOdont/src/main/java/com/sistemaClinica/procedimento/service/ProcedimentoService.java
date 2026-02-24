package com.sistemaClinica.procedimento.service;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.mapper.ProcedimentoMapper;
import com.sistemaClinica.procedimento.model.Procedimento;
import com.sistemaClinica.procedimento.repository.ProcedimentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcedimentoService {

    private final ProcedimentoRepository procedimentoRepository;
    private final ProcedimentoMapper procedimentoMapper;

    public ProcedimentoService(ProcedimentoRepository procedimentoRepository, ProcedimentoMapper procedimentoMapper) {
        this.procedimentoRepository = procedimentoRepository;
        this.procedimentoMapper = procedimentoMapper;
    }

    public List<ProcedimentoDTO> listarTodos() {
        return procedimentoRepository.findAll().stream()
                .map(procedimentoMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProcedimentoDTO buscarPorId(String id) {
        return procedimentoRepository.findById(id)
                .map(procedimentoMapper::toDto)
                .orElse(null);
    }

    public ProcedimentoDTO salvar(ProcedimentoDTO dto) {
        Procedimento procedimento = procedimentoMapper.toEntity(dto);
        return procedimentoMapper.toDto(procedimentoRepository.save(procedimento));
    }

    public void deletar(String id) {
        procedimentoRepository.deleteById(id);
    }
}
