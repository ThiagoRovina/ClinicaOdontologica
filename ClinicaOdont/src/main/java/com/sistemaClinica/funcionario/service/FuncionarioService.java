package com.sistemaClinica.funcionario.service;

import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.dentista.repository.DentistaRepository;
import com.sistemaClinica.consulta.repository.ConsultaRepository;
import com.sistemaClinica.funcionario.dto.FuncionarioCadastroDTO;
import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.mapper.FuncionarioMapper;
import com.sistemaClinica.funcionario.model.Funcionario;
import com.sistemaClinica.funcionario.model.TipoFuncionario;
import com.sistemaClinica.funcionario.repository.FuncionarioRepository;
import com.sistemaClinica.prontuario.repository.ProntuarioRepository;
import com.sistemaClinica.usuario.model.Usuario;
import com.sistemaClinica.usuario.repository.UsuarioRepository;
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

    @Autowired
    private DentistaRepository dentistaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    public List<FuncionarioDTO> listarTodos() {
        return funcionarioRepository.findAll().stream()
                .map(this::toDtoComDentista)
                .collect(Collectors.toList());
    }

    public FuncionarioDTO buscarPorId(String id) {
        return funcionarioRepository.findById(id)
                .map(this::toDtoComDentista)
                .orElse(null);
    }

    @Transactional
    public FuncionarioDTO cadastrarFuncionarioEUsuario(FuncionarioCadastroDTO dto) {
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNmEmail(dto.getEmail());
        novoUsuario.setNmSenha(dto.getSenha());
        
        // Mapeamento de Cargo para Papel (Role)
        String role = switch (dto.getCargo()) {
            case ADMINISTRATIVO -> "ROLE_RECEPCIONISTA";
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

        if (funcionarioSalvo.getCargo() == TipoFuncionario.DENTISTA) {
            upsertDentistaParaFuncionario(funcionarioSalvo);
        }

        return toDtoComDentista(funcionarioSalvo);
    }

    @Transactional
    public FuncionarioDTO salvar(FuncionarioDTO funcionarioDTO) {
        Funcionario funcionario = funcionarioMapper.toEntity(funcionarioDTO);
        Funcionario funcionarioSalvo = funcionarioRepository.save(funcionario);

        if (funcionarioSalvo.getCargo() == TipoFuncionario.DENTISTA) {
            upsertDentistaParaFuncionario(funcionarioSalvo);
        }

        return toDtoComDentista(funcionarioSalvo);
    }

    @Transactional
    public void deletar(String id) {
        Funcionario funcionario = funcionarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Funcionário não encontrado."));

        Dentista dentista = dentistaRepository.findByFuncionario_IdFuncionario(funcionario.getIdFuncionario())
                .orElse(null);

        if (dentista != null) {
            long totalConsultas = consultaRepository.countByDentista_IdDentista(dentista.getIdDentista());
            long totalProntuarios = prontuarioRepository.countByDentista_IdDentista(dentista.getIdDentista());
            if (totalConsultas > 0 || totalProntuarios > 0) {
                throw new IllegalArgumentException("Não é possível excluir: dentista possui consultas/prontuários vinculados.");
            }
            dentistaRepository.deleteByFuncionario_IdFuncionario(funcionario.getIdFuncionario());
        }

        usuarioRepository.deleteByNmEmail(funcionario.getEmail());
        funcionarioRepository.delete(funcionario);
    }

    private FuncionarioDTO toDtoComDentista(Funcionario funcionario) {
        FuncionarioDTO dto = funcionarioMapper.toDto(funcionario);
        dentistaRepository.findByFuncionario_IdFuncionario(funcionario.getIdFuncionario())
                .ifPresent(dentista -> dto.setIdDentista(dentista.getIdDentista()));
        return dto;
    }

    private Dentista upsertDentistaParaFuncionario(Funcionario funcionario) {
        Dentista dentista = dentistaRepository.findByFuncionario_IdFuncionario(funcionario.getIdFuncionario())
                .orElseGet(Dentista::new);

        dentista.setFuncionario(funcionario);
        dentista.setNome(funcionario.getNmFuncionario());
        dentista.setEmail(funcionario.getEmail());
        dentista.setTelefone(funcionario.getTelefone());

        if (dentista.getEspecializacao() == null || dentista.getEspecializacao().isBlank()) {
            dentista.setEspecializacao("A DEFINIR");
        }

        if (dentista.getCro() == null || dentista.getCro().isBlank()) {
            dentista.setCro(gerarCroProvisorio(funcionario.getNuMatricula()));
        }

        return dentistaRepository.save(dentista);
    }

    private String gerarCroProvisorio(int nuMatricula) {
        String base = "PENDENTE-" + nuMatricula;
        if (!dentistaRepository.existsByCro(base)) {
            return base;
        }

        int sufixo = 1;
        String candidato = base + "-" + sufixo;
        while (dentistaRepository.existsByCro(candidato)) {
            sufixo++;
            candidato = base + "-" + sufixo;
        }
        return candidato;
    }
}
