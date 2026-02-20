package com.sistemaClinica.funcionario.mapper;

import com.sistemaClinica.funcionario.dto.FuncionarioDTO;
import com.sistemaClinica.funcionario.model.Funcionario;
import com.sistemaClinica.funcionario.model.TipoFuncionario;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-20T01:14:17-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class FuncionarioMapperImpl implements FuncionarioMapper {

    @Override
    public FuncionarioDTO toDto(Funcionario funcionario) {
        if ( funcionario == null ) {
            return null;
        }

        FuncionarioDTO funcionarioDTO = new FuncionarioDTO();

        if ( funcionario.getCargo() != null ) {
            funcionarioDTO.setCargo( funcionario.getCargo().name() );
        }
        funcionarioDTO.setDataAdmissao( funcionario.getDataAdmissao() );
        funcionarioDTO.setEmail( funcionario.getEmail() );
        funcionarioDTO.setIdFuncionario( funcionario.getIdFuncionario() );
        funcionarioDTO.setNmFuncionario( funcionario.getNmFuncionario() );
        funcionarioDTO.setNuMatricula( funcionario.getNuMatricula() );
        funcionarioDTO.setTelefone( funcionario.getTelefone() );

        return funcionarioDTO;
    }

    @Override
    public Funcionario toEntity(FuncionarioDTO funcionarioDTO) {
        if ( funcionarioDTO == null ) {
            return null;
        }

        Funcionario funcionario = new Funcionario();

        if ( funcionarioDTO.getCargo() != null ) {
            funcionario.setCargo( Enum.valueOf( TipoFuncionario.class, funcionarioDTO.getCargo() ) );
        }
        funcionario.setDataAdmissao( funcionarioDTO.getDataAdmissao() );
        funcionario.setEmail( funcionarioDTO.getEmail() );
        funcionario.setIdFuncionario( funcionarioDTO.getIdFuncionario() );
        funcionario.setNmFuncionario( funcionarioDTO.getNmFuncionario() );
        funcionario.setNuMatricula( funcionarioDTO.getNuMatricula() );
        funcionario.setTelefone( funcionarioDTO.getTelefone() );

        return funcionario;
    }
}
