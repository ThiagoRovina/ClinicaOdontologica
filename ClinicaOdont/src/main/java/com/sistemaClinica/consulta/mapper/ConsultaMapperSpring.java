package com.sistemaClinica.consulta.mapper;

import com.sistemaClinica.consulta.dto.ConsultaDTO;
import com.sistemaClinica.consulta.model.Consulta;
import com.sistemaClinica.dentista.mapper.DentistaMapper;
import com.sistemaClinica.paciente.mapper.PacienteMapper;
import org.springframework.stereotype.Component;

@Component
public class ConsultaMapperSpring implements ConsultaMapper {
    private final PacienteMapper pacienteMapper;
    private final DentistaMapper dentistaMapper;

    public ConsultaMapperSpring(PacienteMapper pacienteMapper, DentistaMapper dentistaMapper) {
        this.pacienteMapper = pacienteMapper;
        this.dentistaMapper = dentistaMapper;
    }

    @Override
    public ConsultaDTO toDto(Consulta consulta) {
        if (consulta == null) {
            return null;
        }

        ConsultaDTO consultaDTO = new ConsultaDTO();
        consultaDTO.setIdConsulta(consulta.getIdConsulta());
        consultaDTO.setPaciente(pacienteMapper.toDto(consulta.getPaciente()));
        consultaDTO.setDentista(dentistaMapper.toDto(consulta.getDentista()));
        consultaDTO.setDataHora(consulta.getDataHora());
        consultaDTO.setStatus(consulta.getStatus());
        consultaDTO.setObservacoes(consulta.getObservacoes());
        return consultaDTO;
    }

    @Override
    public Consulta toEntity(ConsultaDTO consultaDTO) {
        if (consultaDTO == null) {
            return null;
        }

        Consulta consulta = new Consulta();
        consulta.setIdConsulta(consultaDTO.getIdConsulta());
        consulta.setPaciente(pacienteMapper.toEntity(consultaDTO.getPaciente()));
        consulta.setDentista(dentistaMapper.toEntity(consultaDTO.getDentista()));
        consulta.setDataHora(consultaDTO.getDataHora());
        consulta.setStatus(consultaDTO.getStatus());
        consulta.setObservacoes(consultaDTO.getObservacoes());
        return consulta;
    }
}
