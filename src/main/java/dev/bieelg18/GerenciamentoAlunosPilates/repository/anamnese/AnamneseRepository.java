package dev.bieelg18.GerenciamentoAlunosPilates.repository.anamnese;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.anamnese.Anamnese;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnamneseRepository extends JpaRepository<Anamnese, Integer> {

    Optional<Anamnese> findByAlunoIdAndAlunoEstudioId(Integer alunoId, Long estudioId);

    Optional<Anamnese> findByIdAndAlunoEstudioId(Integer id, Long estudioId);

}
