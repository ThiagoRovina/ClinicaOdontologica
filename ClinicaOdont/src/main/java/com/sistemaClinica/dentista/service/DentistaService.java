package com.sistemaClinica.dentista.service;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.mapper.DentistaMapper;
import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.dentista.repository.DentistaRepository;
import com.sistemaClinica.shared.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DentistaService {

    @Autowired
    private DentistaRepository dentistaRepository;

    @Autowired
    private DentistaMapper dentistaMapper;

    public List<DentistaDTO> listarTodos() {
        return dentistaRepository.findAll().stream()
                .map(dentistaMapper::toDto)
                .collect(Collectors.toList());
    }

    public DentistaDTO buscarPorId(Integer id) {
        return dentistaRepository.findById(id)
                .map(dentistaMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Dentista nao encontrado"));
    }

    public DentistaDTO salvar(DentistaDTO dentistaDTO) {
        Dentista dentista = dentistaMapper.toEntity(dentistaDTO);
        return dentistaMapper.toDto(dentistaRepository.save(dentista));
    }

    public void deletar(Integer id) {
        if (!dentistaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Dentista nao encontrado");
        }
        dentistaRepository.deleteById(id);
    }
}
