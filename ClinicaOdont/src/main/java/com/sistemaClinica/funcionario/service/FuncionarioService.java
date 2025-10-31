package com.sistemaClinica.funcionario.service;

import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.mapper.FuncionarioMapper;
import com.sistemaClinica.funcionario.model.Funcionario;
import com.sistemaClinica.funcionario.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private FuncionarioMapper funcionarioMapper;

    public List<FuncionarioDTO> listarTodos() {
        return funcionarioRepository.findAll().stream()
                .map(funcionarioMapper::toDto)
                .collect(Collectors.toList());
    }

    public FuncionarioDTO buscarPorId(String id) {
        return funcionarioRepository.findById(id)
                .map(funcionarioMapper::toDto)
                .orElse(null);
    }

    public FuncionarioDTO salvar(FuncionarioDTO funcionarioDTO) {
        Funcionario funcionario = funcionarioMapper.toEntity(funcionarioDTO);
        return funcionarioMapper.toDto(funcionarioRepository.save(funcionario));
    }

    public void deletar(String id) {
        funcionarioRepository.deleteById(id);
    }
}
