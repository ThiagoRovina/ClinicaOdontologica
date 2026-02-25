package com.sistemaClinica.paciente.service;

import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.paciente.mapper.PacienteMapper;
import com.sistemaClinica.paciente.model.Paciente;
import com.sistemaClinica.paciente.repository.PacienteRepository;
import com.sistemaClinica.paciente.util.CpfUtils;
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

    public PacienteDTO buscarPorId(String id) {
        return pacienteRepository.findById(id)
                .map(pacienteMapper::toDto)
                .orElse(null);
    }

    public PacienteDTO salvar(PacienteDTO pacienteDTO) {
        String cpfNormalizado = CpfUtils.manterApenasDigitos(pacienteDTO.getCpf());
        if (!CpfUtils.isCpfValido(cpfNormalizado)) {
            throw new IllegalArgumentException("CPF inválido.");
        }

        String cpfFormatado = CpfUtils.formatarCpf(cpfNormalizado);
        validarCpfDuplicado(pacienteDTO.getIdPaciente(), cpfFormatado);

        Paciente paciente = pacienteMapper.toEntity(pacienteDTO);
        paciente.setCpf(cpfFormatado);
        return pacienteMapper.toDto(pacienteRepository.save(paciente));
    }

    public void deletar(String id) {
        pacienteRepository.deleteById(id);
    }

    private void validarCpfDuplicado(String idPaciente, String cpfFormatado) {
        if (idPaciente == null || idPaciente.isBlank()) {
            if (pacienteRepository.existsByCpf(cpfFormatado)) {
                throw new IllegalArgumentException("CPF já cadastrado.");
            }
            return;
        }



        pacienteRepository.findByCpf(cpfFormatado).ifPresent(pacienteExistente -> {
            if (!idPaciente.equals(pacienteExistente.getIdPaciente())) {
                throw new IllegalArgumentException("CPF já cadastrado para outro paciente.");
            }
        });
    }
}
