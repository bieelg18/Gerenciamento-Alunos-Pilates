package dev.bieelg18.GerenciamentoAlunosPilates.repository.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlunoRepository extends JpaRepository<Aluno, Integer> {

    List<Aluno> findByNomeContainingIgnoreCase(String nome);

}
