package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.fichaAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula.AtividadeFichaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula.CriarFichaAulaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.AtividadeFicha;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CriarFichaAulaMapper {

    @Mapping(source = "aluno.id", target = "alunoId")
    CriarFichaAulaDTO toDTO(FichaDeAula fichaDeAula);

    @Mapping(target = "aluno", ignore = true)
    @Mapping(target = "professor", ignore = true)
    FichaDeAula toEntity(CriarFichaAulaDTO dto);

    AtividadeFicha toEntity(AtividadeFichaDTO dto);

}
