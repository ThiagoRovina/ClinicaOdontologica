package com.sistemaClinica.procedimento.mapper;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.model.Procedimento;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-24T16:39:27-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Arch Linux)"
)
public class ProcedimentoMapperImpl implements ProcedimentoMapper {

    @Override
    public ProcedimentoDTO toDto(Procedimento procedimento) {
        if ( procedimento == null ) {
            return null;
        }

        ProcedimentoDTO procedimentoDTO = new ProcedimentoDTO();

        procedimentoDTO.setIdProcedimento( procedimento.getIdProcedimento() );
        procedimentoDTO.setNome( procedimento.getNome() );
        procedimentoDTO.setDescricao( procedimento.getDescricao() );
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
