package dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Professor;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "tb_fichas")
public class FichaDeAula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data_aula", nullable = false)
    private LocalDate dataAula;

    @ElementCollection
    @CollectionTable(
            name = "tb_atividades_ficha",
            joinColumns = @JoinColumn(name = "ficha_aula_id")
    )
    private Set<AtividadeFicha> atividades = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "avaliacao_power_house", nullable = false)
    private AvaliacaoPowerHouse avaliacaoPowerHouse;

    @Enumerated(EnumType.STRING)
    @Column(name = "condicao_dor_chegada", nullable = false)
    private EstadoDor condicaoDorChegada;

    @Column(name = "localizacao_dor_chegada")
    private String localizacaoDorChegada;

    @Column(name = "escala_dor")
    @Min(1)
    @Max(10)
    private Integer escalaDor;

    @Enumerated(EnumType.STRING)
    @Column(name = "condicao_dor_final", nullable = false)
    private EstadoDor condicaoDorFinal;

    private String observacoes;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;


}
