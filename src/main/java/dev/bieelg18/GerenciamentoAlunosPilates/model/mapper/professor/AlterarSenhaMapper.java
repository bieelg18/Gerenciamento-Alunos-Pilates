package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.professor.AlterarSenhaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Professor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AlterarSenhaMapper {

    AlterarSenhaDTO toDTO(Professor professor);

    Professor toEntity(AlterarSenhaDTO dto);

}
