package com.sistemaClinica.dentista.mapper;

import com.sistemaClinica.dentista.dto.DentistaDTO;
import com.sistemaClinica.dentista.model.Dentista;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-10T10:54:09-0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.8 (JetBrains s.r.o.)"
)
@Component
public class DentistaMapperImpl implements DentistaMapper {

    @Override
    public DentistaDTO toDto(Dentista dentista) {
        if ( dentista == null ) {
            return null;
        }

        DentistaDTO dentistaDTO = new DentistaDTO();

        dentistaDTO.setIdDentista( dentista.getIdDentista() );
        dentistaDTO.setNome( dentista.getNome() );
        dentistaDTO.setEspecializacao( dentista.getEspecializacao() );
        dentistaDTO.setCro( dentista.getCro() );
        dentistaDTO.setEmail( dentista.getEmail() );
        dentistaDTO.setTelefone( dentista.getTelefone() );

        return dentistaDTO;
    }

    @Override
    public Dentista toEntity(DentistaDTO dentistaDTO) {
        if ( dentistaDTO == null ) {
            return null;
        }

        Dentista dentista = new Dentista();

        dentista.setIdDentista( dentistaDTO.getIdDentista() );
        dentista.setNome( dentistaDTO.getNome() );
        dentista.setEspecializacao( dentistaDTO.getEspecializacao() );
        dentista.setCro( dentistaDTO.getCro() );
        dentista.setEmail( dentistaDTO.getEmail() );
        dentista.setTelefone( dentistaDTO.getTelefone() );

        return dentista;
    }
}
