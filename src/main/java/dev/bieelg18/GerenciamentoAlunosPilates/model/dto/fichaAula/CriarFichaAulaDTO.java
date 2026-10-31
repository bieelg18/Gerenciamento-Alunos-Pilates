package dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.Aparelhos;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.AvaliacaoPowerHouse;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.EstadoDor;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import java.util.Set;

public record CriarFichaAulaDTO(
        LocalDate dataAula,
        Set<Aparelhos> aparelhos,
        Set<AtividadeFichaDTO> atividades,
        AvaliacaoPowerHouse avaliacaoPowerHouse,
        EstadoDor condicaoDorChegada,
        String localizacaoDorChegada,
        @Min(1)
        @Max(10)
        Integer escalaDor,
        EstadoDor condicaoDorFinal,
        String observacoes,
        Integer alunoId
) {}
