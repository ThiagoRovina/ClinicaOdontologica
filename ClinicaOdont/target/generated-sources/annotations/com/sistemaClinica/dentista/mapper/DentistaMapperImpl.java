package com.sistemaClinica.dentista.mapper;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.model.Dentista;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-20T01:14:17-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class DentistaMapperImpl implements DentistaMapper {

    @Override
    public DentistaDTO toDto(Dentista dentista) {
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

    @Override
    public Dentista toEntity(DentistaDTO dentistaDTO) {
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
}
