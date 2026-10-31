package dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Sexo;

import java.time.LocalDate;

public record AlunoDTO(
        Integer id,
        String nome,
        LocalDate dataNascimento,
        Sexo sexo,
        String telefone,
        String profissao,
        String patologia
) {
}
