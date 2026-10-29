package dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.anamnese.Anamnese;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "tb_aluno")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sexo sexo;

    @Column(nullable = false)
    private String telefone;

    @Column(nullable = false)
    private String profissao;

    @Column(nullable = false)
    private String patologia;

    @OneToOne(mappedBy = "aluno")
    private Anamnese anamnese;

    @OneToMany(mappedBy = "aluno")
    private List<FichaDeAula> fichas;

}
