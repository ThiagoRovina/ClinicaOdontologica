package com.sistemaClinica.consulta.service;

import com.sistemaClinica.consulta.dto.ConsultaDTO;
import com.sistemaClinica.consulta.mapper.ConsultaMapper;
import com.sistemaClinica.consulta.model.Consulta;
import com.sistemaClinica.consulta.model.StatusConsulta;
import com.sistemaClinica.consulta.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private ConsultaMapper consultaMapper;

    public List<ConsultaDTO> listarTodas() {
        return consultaRepository.findAll().stream()
                .map(consultaMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ConsultaDTO> listarAgendadasParaHoje() {
        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();
        LocalDateTime fimDoDia = LocalDate.now().atTime(23, 59, 59);
        return consultaRepository.findByDataHoraBetweenAndStatus(inicioDoDia, fimDoDia, StatusConsulta.AGENDADA)
                .stream()
                .map(consultaMapper::toDto)
                .collect(Collectors.toList());
    }

    public ConsultaDTO salvar(ConsultaDTO consultaDTO) {
        Consulta consulta = consultaMapper.toEntity(consultaDTO);
        return consultaMapper.toDto(consultaRepository.save(consulta));
    }

    public ConsultaDTO cancelar(String id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));
        consulta.setStatus(StatusConsulta.CANCELADA);
        return consultaMapper.toDto(consultaRepository.save(consulta));
    }

    public ConsultaDTO finalizar(String id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));
        consulta.setStatus(StatusConsulta.FINALIZADA);
        return consultaMapper.toDto(consultaRepository.save(consulta));
    }
}
