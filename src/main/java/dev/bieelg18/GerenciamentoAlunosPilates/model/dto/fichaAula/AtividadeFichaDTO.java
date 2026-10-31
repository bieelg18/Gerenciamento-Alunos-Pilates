package dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.RegiaoCorporal;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.TipoAtividade;

public record AtividadeFichaDTO(
        RegiaoCorporal regiaoCorporal,
        TipoAtividade tipoAtividade
) {
}
