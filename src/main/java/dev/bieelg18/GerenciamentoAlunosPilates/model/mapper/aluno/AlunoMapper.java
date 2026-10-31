package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.AlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AlunoMapper {

    AlunoDTO toDTO(Aluno aluno);
    Aluno toEntity(AlunoDTO dto);

}
