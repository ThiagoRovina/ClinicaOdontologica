package com.sistemaClinica.consulta.mapper;

import com.sistemaClinica.consulta.dto.ConsultaDTO;
import com.sistemaClinica.consulta.model.Consulta;
import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.paciente.dto.PacienteDTO;
import com.sistemaClinica.paciente.model.Paciente;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-20T01:14:17-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class ConsultaMapperImpl implements ConsultaMapper {

    @Override
    public ConsultaDTO toDto(Consulta consulta) {
        if ( consulta == null ) {
            return null;
        }

        ConsultaDTO consultaDTO = new ConsultaDTO();

        consultaDTO.setDataHora( consulta.getDataHora() );
        consultaDTO.setDentista( dentistaToDentistaDTO( consulta.getDentista() ) );
        consultaDTO.setIdConsulta( consulta.getIdConsulta() );
        consultaDTO.setObservacoes( consulta.getObservacoes() );
        consultaDTO.setPaciente( pacienteToPacienteDTO( consulta.getPaciente() ) );

        return consultaDTO;
    }

    @Override
    public Consulta toEntity(ConsultaDTO consultaDTO) {
        if ( consultaDTO == null ) {
            return null;
        }

        Consulta consulta = new Consulta();

        consulta.setDataHora( consultaDTO.getDataHora() );
        consulta.setDentista( dentistaDTOToDentista( consultaDTO.getDentista() ) );
        consulta.setIdConsulta( consultaDTO.getIdConsulta() );
        consulta.setObservacoes( consultaDTO.getObservacoes() );
        consulta.setPaciente( pacienteDTOToPaciente( consultaDTO.getPaciente() ) );

        return consulta;
    }

    protected DentistaDTO dentistaToDentistaDTO(Dentista dentista) {
        if ( dentista == null ) {
            return null;
        }

        DentistaDTO dentistaDTO = new DentistaDTO();

        dentistaDTO.setCro( dentista.getCro() );
        dentistaDTO.setEmail( dentista.getEmail() );
        dentistaDTO.setEspecializacao( dentista.getEspecializacao() );
        dentistaDTO.setIdDentista( dentista.getIdDentista() );
        dentistaDTO.setNome( dentista.getNome() );
        dentistaDTO.setTelefone( dentista.getTelefone() );

        return dentistaDTO;
    }

    protected PacienteDTO pacienteToPacienteDTO(Paciente paciente) {
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

    protected Dentista dentistaDTOToDentista(DentistaDTO dentistaDTO) {
        if ( dentistaDTO == null ) {
            return null;
        }

        Dentista dentista = new Dentista();

        dentista.setCro( dentistaDTO.getCro() );
        dentista.setEmail( dentistaDTO.getEmail() );
        dentista.setEspecializacao( dentistaDTO.getEspecializacao() );
        dentista.setIdDentista( dentistaDTO.getIdDentista() );
        dentista.setNome( dentistaDTO.getNome() );
        dentista.setTelefone( dentistaDTO.getTelefone() );

        return dentista;
    }

    protected Paciente pacienteDTOToPaciente(PacienteDTO pacienteDTO) {
        if ( pacienteDTO == null ) {
            return null;
        }

        Paciente paciente = new Paciente();

        paciente.setCpf( pacienteDTO.getCpf() );
        paciente.setDataNascimento( pacienteDTO.getDataNascimento() );
        paciente.setEmail( pacienteDTO.getEmail() );
        paciente.setEndereco( pacienteDTO.getEndereco() );
        paciente.setIdPaciente( pacienteDTO.getIdPaciente() );
        paciente.setNome( pacienteDTO.getNome() );
        paciente.setTelefone( pacienteDTO.getTelefone() );

        return paciente;
    }
}
