package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.anamnese;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.anamnese.CriarAnamneseDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.anamnese.Anamnese;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CriarAnamneseMapper {

    @Mapping(source = "aluno.id", target = "alunoId")
    CriarAnamneseDTO toDTO(Anamnese anamnese);

    @Mapping(target = "aluno", ignore = true)
    Anamnese toEntity(CriarAnamneseDTO dto);

}
