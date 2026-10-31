package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.fichaAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula.FichaDeAulaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FichaDeAulaMapper {

    FichaDeAulaDTO toDTO(FichaDeAula fichaDeAula);

    FichaDeAula toEntity(FichaDeAulaDTO dto);

}
