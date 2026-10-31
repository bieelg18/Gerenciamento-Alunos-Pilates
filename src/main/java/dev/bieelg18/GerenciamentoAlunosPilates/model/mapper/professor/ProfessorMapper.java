package dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.professor.ProfessorDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Professor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfessorMapper {

    ProfessorDTO toDTO(Professor professor);

    Professor toEntity(ProfessorDTO dto);

}
