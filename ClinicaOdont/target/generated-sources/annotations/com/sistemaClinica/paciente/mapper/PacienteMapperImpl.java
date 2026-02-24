package com.sistemaClinica.paciente.mapper;

import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.paciente.model.Paciente;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-24T19:23:53-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
public class PacienteMapperImpl implements PacienteMapper {

    @Override
    public PacienteDTO toDto(Paciente paciente) {
        if ( paciente == null ) {
            return null;
        }

        PacienteDTO pacienteDTO = new PacienteDTO();

        pacienteDTO.setCpf( paciente.getCpf() );
        pacienteDTO.setDataNascimento( paciente.getDataNascimento() );
        pacienteDTO.setEmail( paciente.getEmail() );
        pacienteDTO.setEndereco( paciente.getEndereco() );
        pacienteDTO.setIdPaciente( paciente.getIdPaciente() );
        pacienteDTO.setNome( paciente.getNome() );
        pacienteDTO.setTelefone( paciente.getTelefone() );

        return pacienteDTO;
    }

    @Override
    public Paciente toEntity(PacienteDTO pacienteDTO) {
        if ( pacienteDTO == null ) {
            return null;
        }

        Paciente paciente = new Paciente();

        paciente.setIdPaciente( pacienteDTO.getIdPaciente() );
        paciente.setNome( pacienteDTO.getNome() );
        paciente.setDataNascimento( pacienteDTO.getDataNascimento() );
        paciente.setEndereco( pacienteDTO.getEndereco() );
        paciente.setTelefone( pacienteDTO.getTelefone() );
        paciente.setEmail( pacienteDTO.getEmail() );
        paciente.setCpf( pacienteDTO.getCpf() );

        return paciente;
    }
}
