package com.sistemaClinica.procedimento.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.model.Procedimento;

@Mapper(componentModel = "spring")
public interface ProcedimentoMapper {
    ProcedimentoMapper INSTANCE = Mappers.getMapper(ProcedimentoMapper.class);

    ProcedimentoDTO toDto(Procedimento procedimento);

    Procedimento toEntity(ProcedimentoDTO procedimentoDTO);
}
