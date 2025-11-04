package com.sistemaClinica.funcionario.service;

import com.sistemaClinica.funcionario.dto.FuncionarioCadastroDTO;
import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.mapper.FuncionarioMapper;
import com.sistemaClinica.funcionario.model.Funcionario;
import com.sistemaClinica.funcionario.model.TipoFuncionario;
import com.sistemaClinica.funcionario.repository.FuncionarioRepository;
import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private UsuarioService usuarioService;

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

    @Transactional
    public FuncionarioDTO cadastrarFuncionarioEUsuario(FuncionarioCadastroDTO dto) {
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNmEmail(dto.getEmail());
        novoUsuario.setNmSenha(dto.getSenha());
        
        // Mapeamento de Cargo para Papel (Role)
        String role = switch (dto.getCargo()) {
            case ADMINISTRATIVO -> "ROLE_ADMINISTRATIVO";
            case DENTISTA -> "ROLE_DENTISTA";
            case GERENTE -> "ROLE_GERENTE";
            default -> "ROLE_USER"; // Uma role padrão para outros cargos
        };
        novoUsuario.setDsRole(role);

        usuarioService.registrar(novoUsuario);

        Funcionario funcionario = new Funcionario();
        funcionario.setNmFuncionario(dto.getNmFuncionario());
        funcionario.setNuMatricula(dto.getNuMatricula());
        funcionario.setCargo(dto.getCargo());
        funcionario.setDataAdmissao(dto.getDataAdmissao());
        funcionario.setEmail(dto.getEmail());
        funcionario.setTelefone(dto.getTelefone());

        Funcionario funcionarioSalvo = funcionarioRepository.save(funcionario);
        return funcionarioMapper.toDto(funcionarioSalvo);
    }

    public FuncionarioDTO salvar(FuncionarioDTO funcionarioDTO) {
        Funcionario funcionario = funcionarioMapper.toEntity(funcionarioDTO);
        return funcionarioMapper.toDto(funcionarioRepository.save(funcionario));
    }

    public void deletar(String id) {
        funcionarioRepository.deleteById(id);
    }
}
