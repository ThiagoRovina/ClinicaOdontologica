package com.sistemaClinica.dentista.mapper;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.model.Dentista;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DentistaMapper {
    DentistaMapper INSTANCE = Mappers.getMapper(DentistaMapper.class);
    DentistaDTO toDto(Dentista dentista);
    Dentista toEntity(DentistaDTO dentistaDTO);
}
