package com.sistemaClinica.funcionario.mapper;

import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.model.Funcionario;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FuncionarioMapper {

    FuncionarioMapper INSTANCE = Mappers.getMapper(FuncionarioMapper.class);

    FuncionarioDTO toDto(Funcionario funcionario);

    Funcionario toEntity(FuncionarioDTO funcionarioDTO);
}
