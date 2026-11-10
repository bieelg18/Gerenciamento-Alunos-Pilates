package dev.bieelg18.GerenciamentoAlunosPilates.repository.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlunoRepository extends JpaRepository<Aluno, Integer> {

    List<Aluno> findByEstudioIdAndNomeContainingIgnoreCaseOrderByNomeAsc(Long estudioId, String nome);

    List<Aluno> findAllByEstudioIdOrderByNomeAsc(Long estudioId);

    Optional<Aluno> findByIdAndEstudioId(Integer alunoId, Long estudioId);

}
