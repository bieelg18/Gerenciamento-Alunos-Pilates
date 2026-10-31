package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.anamnese;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.anamnese.AnamneseDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.anamnese.Anamnese;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AnamneseMapper {

    AnamneseDTO toDTO(Anamnese anamnese);

    Anamnese toEntity(AnamneseDTO dto);

}
