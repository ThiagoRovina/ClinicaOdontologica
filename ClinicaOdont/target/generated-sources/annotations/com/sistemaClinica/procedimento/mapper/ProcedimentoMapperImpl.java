package com.sistemaClinica.procedimento.mapper;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.model.Procedimento;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-24T19:23:53-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
public class ProcedimentoMapperImpl implements ProcedimentoMapper {

    @Override
    public ProcedimentoDTO toDto(Procedimento procedimento) {
        if ( procedimento == null ) {
            return null;
        }

        ProcedimentoDTO procedimentoDTO = new ProcedimentoDTO();

        procedimentoDTO.setDescricao( procedimento.getDescricao() );
        procedimentoDTO.setIdProcedimento( procedimento.getIdProcedimento() );
        procedimentoDTO.setNome( procedimento.getNome() );
        procedimentoDTO.setValor( procedimento.getValor() );

        return procedimentoDTO;
    }

    @Override
    public Procedimento toEntity(ProcedimentoDTO procedimentoDTO) {
        if ( procedimentoDTO == null ) {
            return null;
        }

        Procedimento procedimento = new Procedimento();

        procedimento.setIdProcedimento( procedimentoDTO.getIdProcedimento() );
        procedimento.setNome( procedimentoDTO.getNome() );
        procedimento.setDescricao( procedimentoDTO.getDescricao() );
        procedimento.setValor( procedimentoDTO.getValor() );

        return procedimento;
    }
}
