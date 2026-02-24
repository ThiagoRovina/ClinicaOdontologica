package com.sistemaClinica.consulta.mapper;

import com.sistemaClinica.consulta.dto.ConsultaDTO;
import com.sistemaClinica.consulta.model.Consulta;
import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.paciente.model.Paciente;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-24T14:25:11-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.9 (Arch Linux)"
)
public class ConsultaMapperImpl implements ConsultaMapper {

    @Override
    public ConsultaDTO toDto(Consulta consulta) {
        if ( consulta == null ) {
            return null;
        }

        ConsultaDTO consultaDTO = new ConsultaDTO();

        consultaDTO.setIdConsulta( consulta.getIdConsulta() );
        consultaDTO.setPaciente( pacienteToPacienteDTO( consulta.getPaciente() ) );
        consultaDTO.setDentista( dentistaToDentistaDTO( consulta.getDentista() ) );
        consultaDTO.setDataHora( consulta.getDataHora() );
        consultaDTO.setStatus( consulta.getStatus() );
        consultaDTO.setObservacoes( consulta.getObservacoes() );

        return consultaDTO;
    }

    @Override
    public Consulta toEntity(ConsultaDTO consultaDTO) {
        if ( consultaDTO == null ) {
            return null;
        }

        Consulta consulta = new Consulta();

        consulta.setIdConsulta( consultaDTO.getIdConsulta() );
        consulta.setPaciente( pacienteDTOToPaciente( consultaDTO.getPaciente() ) );
        consulta.setDentista( dentistaDTOToDentista( consultaDTO.getDentista() ) );
        consulta.setDataHora( consultaDTO.getDataHora() );
        consulta.setStatus( consultaDTO.getStatus() );
        consulta.setObservacoes( consultaDTO.getObservacoes() );

        return consulta;
    }

    protected PacienteDTO pacienteToPacienteDTO(Paciente paciente) {
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

    protected DentistaDTO dentistaToDentistaDTO(Dentista dentista) {
        if ( dentista == null ) {
            return null;
        }

        DentistaDTO dentistaDTO = new DentistaDTO();

        dentistaDTO.setIdDentista( dentista.getIdDentista() );
        dentistaDTO.setNome( dentista.getNome() );
        dentistaDTO.setEspecializacao( dentista.getEspecializacao() );
        dentistaDTO.setCro( dentista.getCro() );
        dentistaDTO.setEmail( dentista.getEmail() );
        dentistaDTO.setTelefone( dentista.getTelefone() );

        return dentistaDTO;
    }

    protected Paciente pacienteDTOToPaciente(PacienteDTO pacienteDTO) {
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

    protected Dentista dentistaDTOToDentista(DentistaDTO dentistaDTO) {
        if ( dentistaDTO == null ) {
            return null;
        }

        Dentista dentista = new Dentista();

        dentista.setIdDentista( dentistaDTO.getIdDentista() );
        dentista.setNome( dentistaDTO.getNome() );
        dentista.setEspecializacao( dentistaDTO.getEspecializacao() );
        dentista.setCro( dentistaDTO.getCro() );
        dentista.setEmail( dentistaDTO.getEmail() );
        dentista.setTelefone( dentistaDTO.getTelefone() );

        return dentista;
    }
}
