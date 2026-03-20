package com.sistemaClinica.procedimento.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.mapper.ProcedimentoMapper;
import com.sistemaClinica.procedimento.model.Procedimento;
import com.sistemaClinica.procedimento.repository.ProcedimentoRepository;
import com.sistemaClinica.shared.ResourceNotFoundException;

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

    public ProcedimentoDTO buscarPorId(Integer id) {
        return procedimentoRepository.findById(id)
                .map(procedimentoMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Procedimento nao encontrado"));
    }

    public ProcedimentoDTO salvar(ProcedimentoDTO procedimentoDTO) {
        Procedimento procedimento = procedimentoMapper.toEntity(procedimentoDTO);
        return procedimentoMapper.toDto(procedimentoRepository.save(procedimento));
    }

    public void deletar(Integer id) {
        if (!procedimentoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Procedimento nao encontrado");
        }
        procedimentoRepository.deleteById(id);
    }
}
