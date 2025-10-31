package com.sistemaClinica.funcionario.mapper;

import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.model.Funcionario;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-30T20:36:57-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class FuncionarioMapperImpl implements FuncionarioMapper {

    @Override
    public FuncionarioDTO toDto(Funcionario funcionario) {
        if ( funcionario == null ) {
            return null;
        }

        FuncionarioDTO funcionarioDTO = new FuncionarioDTO();

        funcionarioDTO.setIdFuncionario( funcionario.getIdFuncionario() );
        funcionarioDTO.setNmFuncionario( funcionario.getNmFuncionario() );
        funcionarioDTO.setNuMatricula( funcionario.getNuMatricula() );
        funcionarioDTO.setCargo( funcionario.getCargo() );
        funcionarioDTO.setDataAdmissao( funcionario.getDataAdmissao() );
        funcionarioDTO.setEmail( funcionario.getEmail() );
        funcionarioDTO.setTelefone( funcionario.getTelefone() );

        return funcionarioDTO;
    }

    @Override
    public Funcionario toEntity(FuncionarioDTO funcionarioDTO) {
        if ( funcionarioDTO == null ) {
            return null;
        }

        Funcionario funcionario = new Funcionario();

        funcionario.setIdFuncionario( funcionarioDTO.getIdFuncionario() );
        funcionario.setNmFuncionario( funcionarioDTO.getNmFuncionario() );
        funcionario.setNuMatricula( funcionarioDTO.getNuMatricula() );
        funcionario.setCargo( funcionarioDTO.getCargo() );
        funcionario.setDataAdmissao( funcionarioDTO.getDataAdmissao() );
        funcionario.setEmail( funcionarioDTO.getEmail() );
        funcionario.setTelefone( funcionarioDTO.getTelefone() );

        return funcionario;
    }
}
