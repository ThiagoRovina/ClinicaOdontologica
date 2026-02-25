package com.sistemaClinica.dentista.service;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.mapper.DentistaMapper;
import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.dentista.repository.DentistaRepository;
import com.sistemaClinica.funcionario.model.Funcionario;
import com.sistemaClinica.funcionario.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DentistaService {

    @Autowired
    private DentistaRepository dentistaRepository;

    @Autowired
    private DentistaMapper dentistaMapper;

    @Autowired
    private FuncionarioRepository funcionarioRepository;

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

    public DentistaDTO buscarPorFuncionarioId(String idFuncionario) {
        return dentistaRepository.findByFuncionario_IdFuncionario(idFuncionario)
                .map(dentistaMapper::toDto)
                .orElse(null);
    }

    @Transactional
    public DentistaDTO salvar(DentistaDTO dentistaDTO) {
        Dentista dentista = null;

        if (dentistaDTO.getIdDentista() != null && !dentistaDTO.getIdDentista().isBlank()) {
            dentista = dentistaRepository.findById(dentistaDTO.getIdDentista()).orElse(null);
        }
        if (dentista == null && dentistaDTO.getIdFuncionario() != null && !dentistaDTO.getIdFuncionario().isBlank()) {
            dentista = dentistaRepository.findByFuncionario_IdFuncionario(dentistaDTO.getIdFuncionario()).orElse(null);
        }
        if (dentista == null) {
            dentista = new Dentista();
        }

        dentista.setNome(dentistaDTO.getNome());
        dentista.setEspecializacao(dentistaDTO.getEspecializacao());
        dentista.setCro(dentistaDTO.getCro());
        dentista.setEmail(dentistaDTO.getEmail());
        dentista.setTelefone(dentistaDTO.getTelefone());

        if (dentistaDTO.getIdFuncionario() != null && !dentistaDTO.getIdFuncionario().isBlank()) {
            Funcionario funcionario = funcionarioRepository.findById(dentistaDTO.getIdFuncionario())
                    .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado para vincular ao dentista."));
            dentista.setFuncionario(funcionario);
        }

        if (dentista.getCro() == null || dentista.getCro().isBlank()) {
            throw new IllegalArgumentException("CRO é obrigatório.");
        }

        return dentistaMapper.toDto(dentistaRepository.save(dentista));
    }

    public void deletar(String id) {
        dentistaRepository.deleteById(id);
    }
}
