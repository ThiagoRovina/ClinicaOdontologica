package com.sistemaClinica.dentista.mapper;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.model.Dentista;
import org.mapstruct.Mapper;

@Mapper(componentModel = "default")
public interface DentistaMapper {
    DentistaDTO toDto(Dentista dentista);
    Dentista toEntity(DentistaDTO dentistaDTO);
}
