package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.CriarAlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CriarAlunoMapper {

    CriarAlunoDTO toDTO(Aluno aluno);

    Aluno toEntity(CriarAlunoDTO dto);

}
