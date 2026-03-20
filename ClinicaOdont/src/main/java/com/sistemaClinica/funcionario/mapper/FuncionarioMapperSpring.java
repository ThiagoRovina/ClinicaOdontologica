package com.sistemaClinica.funcionario.mapper;

import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.model.Funcionario;
import com.sistemaClinica.funcionario.model.TipoFuncionario;
import org.springframework.stereotype.Component;

@Component
public class FuncionarioMapperSpring implements FuncionarioMapper {

    @Override
    public FuncionarioDTO toDto(Funcionario funcionario) {
        if (funcionario == null) {
            return null;
        }

        FuncionarioDTO funcionarioDTO = new FuncionarioDTO();
        funcionarioDTO.setIdFuncionario(funcionario.getIdFuncionario());
        funcionarioDTO.setNmFuncionario(funcionario.getNmFuncionario());
        funcionarioDTO.setNuMatricula(funcionario.getNuMatricula());
        if (funcionario.getCargo() != null) {
            funcionarioDTO.setCargo(funcionario.getCargo().name());
        }
        funcionarioDTO.setDataAdmissao(funcionario.getDataAdmissao());
        funcionarioDTO.setEmail(funcionario.getEmail());
        funcionarioDTO.setTelefone(funcionario.getTelefone());
        return funcionarioDTO;
    }

    @Override
    public Funcionario toEntity(FuncionarioDTO funcionarioDTO) {
        if (funcionarioDTO == null) {
            return null;
        }

        Funcionario funcionario = new Funcionario();
        funcionario.setIdFuncionario(funcionarioDTO.getIdFuncionario());
        funcionario.setNmFuncionario(funcionarioDTO.getNmFuncionario());
        funcionario.setNuMatricula(funcionarioDTO.getNuMatricula());
        if (funcionarioDTO.getCargo() != null) {
            funcionario.setCargo(Enum.valueOf(TipoFuncionario.class, funcionarioDTO.getCargo()));
        }
        funcionario.setDataAdmissao(funcionarioDTO.getDataAdmissao());
        funcionario.setEmail(funcionarioDTO.getEmail());
        funcionario.setTelefone(funcionarioDTO.getTelefone());
        return funcionario;
    }
}
