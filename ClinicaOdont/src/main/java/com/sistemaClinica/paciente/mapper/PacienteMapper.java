package com.sistemaClinica.paciente.mapper;

import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.paciente.model.Paciente;
import org.mapstruct.Mapper;

@Mapper(componentModel = "default")
public interface PacienteMapper {
    PacienteDTO toDto(Paciente paciente);

    Paciente toEntity(PacienteDTO pacienteDTO);
}
