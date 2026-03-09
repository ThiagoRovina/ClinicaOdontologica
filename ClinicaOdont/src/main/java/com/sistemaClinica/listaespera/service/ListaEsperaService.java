package com.sistemaClinica.listaespera.service;

import com.sistemaClinica.consulta.model.Consulta;
import com.sistemaClinica.consulta.model.StatusConsulta;
import com.sistemaClinica.consulta.repository.ConsultaRepository;
import com.sistemaClinica.dentista.mapper.DentistaMapper;
import com.sistemaClinica.dentista.model.Dentista;
import com.sistemaClinica.listaespera.dto.ListaEsperaDTO;
import com.sistemaClinica.listaespera.model.ListaEspera;
import com.sistemaClinica.listaespera.model.StatusListaEspera;
import com.sistemaClinica.listaespera.repository.ListaEsperaRepository;
import com.sistemaClinica.paciente.mapper.PacienteMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.CONFLICT;

@Service
public class ListaEsperaService {

    private final ListaEsperaRepository listaEsperaRepository;
    private final ConsultaRepository consultaRepository;
    private final PacienteMapper pacienteMapper;
    private final DentistaMapper dentistaMapper;

    public ListaEsperaService(ListaEsperaRepository listaEsperaRepository,
                              ConsultaRepository consultaRepository,
                              PacienteMapper pacienteMapper,
                              DentistaMapper dentistaMapper) {
        this.listaEsperaRepository = listaEsperaRepository;
        this.consultaRepository = consultaRepository;
        this.pacienteMapper = pacienteMapper;
        this.dentistaMapper = dentistaMapper;
    }

    public List<ListaEsperaDTO> listarTodas() {
        return listaEsperaRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ListaEsperaDTO> listarAtivas() {
        return listaEsperaRepository.findByStatusOrderByDataSolicitacaoAsc(StatusListaEspera.ATIVA).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ListaEsperaDTO salvar(ListaEsperaDTO listaEsperaDTO) {
        if (listaEsperaRepository.existsByPaciente_IdPacienteAndDentista_IdDentistaAndDataPreferidaAndStatus(
                listaEsperaDTO.getPaciente().getIdPaciente(),
                listaEsperaDTO.getDentista().getIdDentista(),
                listaEsperaDTO.getDataPreferida(),
                StatusListaEspera.ATIVA
        )) {
            throw new ResponseStatusException(
                    CONFLICT,
                    "Já existe uma entrada ativa na lista de espera para este paciente, dentista e data"
            );
        }

        ListaEspera listaEspera = toEntity(listaEsperaDTO);
        return toDto(listaEsperaRepository.save(listaEspera));
    }

    public ListaEsperaDTO cancelar(String id) {
        ListaEspera listaEspera = listaEsperaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrada da lista de espera não encontrada"));
        listaEspera.setStatus(StatusListaEspera.CANCELADA);
        return toDto(listaEsperaRepository.save(listaEspera));
    }

    @Transactional
    public Optional<Consulta> tentarEncaixarNoHorarioCancelado(LocalDateTime dataHora, Dentista dentista) {
        if (consultaRepository.existsByDentista_IdDentistaAndDataHoraAndStatus(
                dentista.getIdDentista(), dataHora, StatusConsulta.AGENDADA)) {
            return Optional.empty();
        }

        List<ListaEspera> candidatos = listaEsperaRepository.buscarCandidatosParaEncaixe(
                dentista.getIdDentista(), dataHora.toLocalDate(), dataHora.toLocalTime());

        if (candidatos.isEmpty()) {
            return Optional.empty();
        }

        ListaEspera selecionado = candidatos.get(0);
        Consulta consulta = new Consulta();
        consulta.setPaciente(selecionado.getPaciente());
        consulta.setDentista(dentista);
        consulta.setDataHora(dataHora);
        consulta.setStatus(StatusConsulta.AGENDADA);

        String observacaoBase = selecionado.getObservacoes() == null ? "" : selecionado.getObservacoes().trim();
        String observacaoEncaixe = "Encaixe automático via lista de espera";
        consulta.setObservacoes(observacaoBase.isBlank() ? observacaoEncaixe : observacaoBase + " | " + observacaoEncaixe);

        Consulta consultaCriada = consultaRepository.save(consulta);
        selecionado.setStatus(StatusListaEspera.ATENDIDA);
        listaEsperaRepository.save(selecionado);

        return Optional.of(consultaCriada);
    }

    private ListaEsperaDTO toDto(ListaEspera listaEspera) {
        ListaEsperaDTO dto = new ListaEsperaDTO();
        dto.setIdListaEspera(listaEspera.getIdListaEspera());
        dto.setPaciente(pacienteMapper.toDto(listaEspera.getPaciente()));
        dto.setDentista(dentistaMapper.toDto(listaEspera.getDentista()));
        dto.setDataPreferida(listaEspera.getDataPreferida());
        dto.setHorarioInicioPreferido(listaEspera.getHorarioInicioPreferido());
        dto.setHorarioFimPreferido(listaEspera.getHorarioFimPreferido());
        dto.setStatus(listaEspera.getStatus());
        dto.setDataSolicitacao(listaEspera.getDataSolicitacao());
        dto.setObservacoes(listaEspera.getObservacoes());
        return dto;
    }

    private ListaEspera toEntity(ListaEsperaDTO dto) {
        ListaEspera listaEspera = new ListaEspera();
        listaEspera.setIdListaEspera(dto.getIdListaEspera());
        listaEspera.setPaciente(pacienteMapper.toEntity(dto.getPaciente()));
        listaEspera.setDentista(dentistaMapper.toEntity(dto.getDentista()));
        listaEspera.setDataPreferida(dto.getDataPreferida());
        listaEspera.setHorarioInicioPreferido(dto.getHorarioInicioPreferido());
        listaEspera.setHorarioFimPreferido(dto.getHorarioFimPreferido());
        listaEspera.setStatus(dto.getStatus());
        listaEspera.setDataSolicitacao(dto.getDataSolicitacao());
        listaEspera.setObservacoes(dto.getObservacoes());
        return listaEspera;
    }
}
