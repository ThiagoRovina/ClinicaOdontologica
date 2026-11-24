package com.sistemaClinica.consulta.mapper;

import com.sistemaClinica.consulta.dto.ConsultaDTO;
import com.sistemaClinica.consulta.model.Consulta;
import org.mapstruct.Mapper;

@Mapper(componentModel = "default")
public interface ConsultaMapper {
    ConsultaDTO toDto(Consulta consulta);
    Consulta toEntity(ConsultaDTO consultaDTO);
}
