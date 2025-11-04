package com.sistemaClinica.dentista.service;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.mapper.DentistaMapper;
import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.dentista.repository.DentistaRepository;
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

    public DentistaDTO buscarPorId(String id) {
        return dentistaRepository.findById(id)
                .map(dentistaMapper::toDto)
                .orElse(null);
    }

    public DentistaDTO salvar(DentistaDTO dentistaDTO) {
        Dentista dentista = dentistaMapper.toEntity(dentistaDTO);
        // Lógica para gerar ID se for uma nova entidade, se necessário
        if (dentista.getIdDentista() == null || dentista.getIdDentista().isEmpty()) {
            // O @GeneratedValue cuidará disso se configurado na entidade
        }
        return dentistaMapper.toDto(dentistaRepository.save(dentista));
    }

    public void deletar(String id) {
        dentistaRepository.deleteById(id);
    }
}
