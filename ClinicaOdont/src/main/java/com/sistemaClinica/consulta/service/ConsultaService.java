package com.sistemaClinica.consulta.service;

import com.sistemaClinica.consulta.dto.ConsultaDTO;
import com.sistemaClinica.consulta.mapper.ConsultaMapper;
import com.sistemaClinica.consulta.model.Consulta;
import com.sistemaClinica.consulta.model.StatusConsulta;
import com.sistemaClinica.consulta.repository.ConsultaRepository;
import com.sistemaClinica.financeiro.model.LancamentoFinanceiro;
import com.sistemaClinica.financeiro.model.StatusLancamento;
import com.sistemaClinica.financeiro.model.TipoLancamento;
import com.sistemaClinica.financeiro.repository.LancamentoFinanceiroRepository;
import com.sistemaClinica.procedimento.repository.ProcedimentoRepository;
import com.sistemaClinica.shared.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private LancamentoFinanceiroRepository lancamentoFinanceiroRepository;

    @Autowired
    private ProcedimentoRepository procedimentoRepository;

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
        return consultaRepository.findByDataHoraBetweenOrderByDataHoraAsc(inicioDoDia, fimDoDia)
                .stream()
                .filter(c -> c.getStatus() != StatusConsulta.FINALIZADA && c.getStatus() != StatusConsulta.CANCELADA)
                .map(consultaMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<ConsultaDTO> listarPorPaciente(Integer pacienteId) {
        return consultaRepository.findByPacienteIdPacienteOrderByDataHoraDesc(pacienteId)
                .stream()
                .map(consultaMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
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
        Consulta salva = consultaRepository.save(consulta);

        if (consultaDTO.getProcedimento() != null && consultaDTO.getProcedimento().getIdProcedimento() != null) {
            procedimentoRepository.findById(consultaDTO.getProcedimento().getIdProcedimento()).ifPresent(proc -> {
                LancamentoFinanceiro lancamento = new LancamentoFinanceiro();
                lancamento.setTipo(TipoLancamento.RECEITA);
                lancamento.setDescricao("Consulta - " + proc.getNome());
                lancamento.setValor(proc.getValor());
                lancamento.setData(salva.getDataHora().toLocalDate());
                lancamento.setStatus(consultaDTO.isPagamentoAntecipado() ? StatusLancamento.PAGO : StatusLancamento.PENDENTE);
                lancamento.setPaciente(salva.getPaciente());
                lancamento.setConsulta(salva);
                lancamentoFinanceiroRepository.save(lancamento);
            });
        }

        return consultaMapper.toDto(salva);
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

    public ConsultaDTO confirmar(Integer id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta nao encontrada"));
        consulta.setStatus(StatusConsulta.CONFIRMADA);
        return consultaMapper.toDto(consultaRepository.save(consulta));
    }

    public ConsultaDTO checkIn(Integer id) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta nao encontrada"));
        consulta.setStatus(StatusConsulta.AGUARDANDO_ATENDIMENTO);
        return consultaMapper.toDto(consultaRepository.save(consulta));
    }
}
