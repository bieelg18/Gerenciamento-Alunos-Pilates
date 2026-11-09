package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.AlunoResumoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AlunoResumoMapper {

    AlunoResumoDTO toDTO(Aluno aluno);

    Aluno toEntity(AlunoResumoDTO dto);

}
