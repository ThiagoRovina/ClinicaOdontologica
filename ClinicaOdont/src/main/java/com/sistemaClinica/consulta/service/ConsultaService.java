package com.sistemaClinica.consulta.service;

import com.sistemaClinica.consulta.dto.ConsultaDTO;
import com.sistemaClinica.consulta.mapper.ConsultaMapper;
import com.sistemaClinica.consulta.model.Consulta;
import com.sistemaClinica.consulta.model.StatusConsulta;
import com.sistemaClinica.consulta.repository.ConsultaRepository;
import com.sistemaClinica.shared.ResourceNotFoundException;
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

    public List<ConsultaDTO> listarPorPeriodoEDentista(LocalDate data, Integer dentistaId) {
        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim = data.atTime(23, 59, 59);

        List<Consulta> consultas = dentistaId != null
                ? consultaRepository.findByDentistaIdDentistaAndDataHoraBetweenOrderByDataHoraAsc(dentistaId, inicio, fim)
                : consultaRepository.findByDataHoraBetweenOrderByDataHoraAsc(inicio, fim);

        return consultas.stream().map(consultaMapper::toDto).collect(Collectors.toList());
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
        if (consultaDTO.getDentista() == null || consultaDTO.getDentista().getIdDentista() == null) {
            throw new IllegalArgumentException("Dentista e obrigatorio");
        }

        if (consultaRepository.existsByDentistaIdDentistaAndDataHoraAndStatusNot(
                consultaDTO.getDentista().getIdDentista(),
                consultaDTO.getDataHora(),
                StatusConsulta.CANCELADA
        )) {
            throw new IllegalArgumentException("Ja existe uma consulta ativa para este dentista neste horario");
        }

        Consulta consulta = consultaMapper.toEntity(consultaDTO);
        return consultaMapper.toDto(consultaRepository.save(consulta));
    }

    public void deletar(Integer id) {
        if (!consultaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Consulta nao encontrada");
        }
        consultaRepository.deleteById(id);
    }

    public ConsultaDTO cancelar(Integer id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta nao encontrada"));
        consulta.setStatus(StatusConsulta.CANCELADA);
        return consultaMapper.toDto(consultaRepository.save(consulta));
    }

    public ConsultaDTO finalizar(Integer id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta nao encontrada"));
        consulta.setStatus(StatusConsulta.FINALIZADA);
        return consultaMapper.toDto(consultaRepository.save(consulta));
    }
}
