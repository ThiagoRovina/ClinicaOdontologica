package com.sistemaClinica.procedimento.mapper;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.model.Procedimento;
import org.mapstruct.Mapper;

@Mapper(componentModel = "default")
public interface ProcedimentoMapper {
    ProcedimentoDTO toDto(Procedimento procedimento);
    Procedimento toEntity(ProcedimentoDTO procedimentoDTO);
}
