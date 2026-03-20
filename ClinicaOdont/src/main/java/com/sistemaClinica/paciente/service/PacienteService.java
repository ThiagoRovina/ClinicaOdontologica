package com.sistemaClinica.paciente.service;

import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.paciente.mapper.PacienteMapper;
import com.sistemaClinica.paciente.model.Paciente;
import com.sistemaClinica.paciente.repository.PacienteRepository;
import com.sistemaClinica.shared.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private PacienteMapper pacienteMapper;

    public List<PacienteDTO> listarTodos() {
        return pacienteRepository.findAll().stream()
                .map(pacienteMapper::toDto)
                .collect(Collectors.toList());
    }

    public PacienteDTO buscarPorId(Integer id) {
        return pacienteRepository.findById(id)
                .map(pacienteMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado"));
    }

    public PacienteDTO salvar(PacienteDTO pacienteDTO) {
        Paciente paciente = pacienteMapper.toEntity(pacienteDTO);
        return pacienteMapper.toDto(pacienteRepository.save(paciente));
    }

    public void deletar(Integer id) {
        if (!pacienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Paciente nao encontrado");
        }
        pacienteRepository.deleteById(id);
    }
}
