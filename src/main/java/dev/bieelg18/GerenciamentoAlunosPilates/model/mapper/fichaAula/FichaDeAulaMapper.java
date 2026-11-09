package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.fichaAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula.CriarFichaAulaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula.FichaDeAulaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring",
collectionMappingStrategy = CollectionMappingStrategy.SETTER_PREFERRED)
public interface FichaDeAulaMapper {

    @Mapping(target = "idProfessor", source = "professor.id")
    @Mapping(target = "nomeProfessor", source = "professor.nome")
    @Mapping(target = "turno", source = "professor.turno")
    FichaDeAulaDTO toDTO(FichaDeAula fichaDeAula);

    FichaDeAula toEntity(FichaDeAulaDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "aluno", ignore = true)
    @Mapping(target = "professor", ignore = true)
    void atualizar(CriarFichaAulaDTO dto, @MappingTarget FichaDeAula ficha);

}
