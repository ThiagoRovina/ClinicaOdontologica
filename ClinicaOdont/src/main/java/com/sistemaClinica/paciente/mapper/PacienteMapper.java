package com.sistemaClinica.paciente.mapper;

import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.paciente.model.Paciente;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PacienteMapper {

    PacienteMapper INSTANCE = Mappers.getMapper(PacienteMapper.class);

    PacienteDTO toDto(Paciente paciente);

    Paciente toEntity(PacienteDTO pacienteDTO);
}
