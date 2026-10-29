package dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "tb_professor")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Turno turno;

    private boolean ativo = true;

    @OneToMany(mappedBy = "professor")
    private List<FichaDeAula> fichaDeAulas;

}
