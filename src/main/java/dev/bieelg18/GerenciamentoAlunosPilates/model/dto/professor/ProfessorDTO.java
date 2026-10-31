package dev.bieelg18.GerenciamentoAlunosPilates.model.dto.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Turno;

public record ProfessorDTO(
        String nome,
        Turno turno
) {
}
