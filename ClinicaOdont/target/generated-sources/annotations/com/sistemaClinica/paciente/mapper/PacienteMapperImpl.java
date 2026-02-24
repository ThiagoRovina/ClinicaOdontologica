package com.sistemaClinica.paciente.mapper;

import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.paciente.model.Paciente;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-24T16:39:27-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Arch Linux)"
)
public class PacienteMapperImpl implements PacienteMapper {

    @Override
    public PacienteDTO toDto(Paciente paciente) {
        if ( paciente == null ) {
            return null;
        }

        PacienteDTO pacienteDTO = new PacienteDTO();

        pacienteDTO.setIdPaciente( paciente.getIdPaciente() );
        pacienteDTO.setNome( paciente.getNome() );
        pacienteDTO.setDataNascimento( paciente.getDataNascimento() );
        pacienteDTO.setEndereco( paciente.getEndereco() );
        pacienteDTO.setTelefone( paciente.getTelefone() );
        pacienteDTO.setEmail( paciente.getEmail() );
        pacienteDTO.setCpf( paciente.getCpf() );

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
