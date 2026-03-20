package com.sistemaClinica.procedimento.mapper;

import com.sistemaClinica.procedimento.dto.ProcedimentoDTO;
import com.sistemaClinica.procedimento.model.Procedimento;
import org.springframework.stereotype.Component;

@Component
public class ProcedimentoMapperSpring implements ProcedimentoMapper {

    @Override
    public ProcedimentoDTO toDto(Procedimento procedimento) {
        if (procedimento == null) {
            return null;
        }

        ProcedimentoDTO dto = new ProcedimentoDTO();
        dto.setIdProcedimento(procedimento.getIdProcedimento());
        dto.setNome(procedimento.getNome());
        dto.setDescricao(procedimento.getDescricao());
        dto.setValor(procedimento.getValor());
        return dto;
    }

    @Override
    public Procedimento toEntity(ProcedimentoDTO procedimentoDTO) {
        if (procedimentoDTO == null) {
            return null;
        }

        Procedimento procedimento = new Procedimento();
        procedimento.setIdProcedimento(procedimentoDTO.getIdProcedimento());
        procedimento.setNome(procedimentoDTO.getNome());
        procedimento.setDescricao(procedimentoDTO.getDescricao());
        procedimento.setValor(procedimentoDTO.getValor());
        return procedimento;
    }
}
