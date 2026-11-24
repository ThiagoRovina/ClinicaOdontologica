package com.sistemaClinica.funcionario.mapper;

import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.model.Funcionario;
import org.mapstruct.Mapper;

@Mapper(componentModel = "default")
public interface FuncionarioMapper {
    FuncionarioDTO toDto(Funcionario funcionario);

    Funcionario toEntity(FuncionarioDTO funcionarioDTO);
}
