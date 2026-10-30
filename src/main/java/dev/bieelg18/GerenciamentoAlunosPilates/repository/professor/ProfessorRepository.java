package dev.bieelg18.GerenciamentoAlunosPilates.repository.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Integer> {

    Optional<Professor> findByEmail(String email);

}
