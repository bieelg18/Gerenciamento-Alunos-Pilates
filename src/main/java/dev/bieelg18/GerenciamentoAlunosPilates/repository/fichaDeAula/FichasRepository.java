package dev.bieelg18.GerenciamentoAlunosPilates.repository.fichaDeAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FichasRepository extends JpaRepository<FichaDeAula, Integer> {

    List<FichaDeAula> findByAlunoIdAndAlunoEstudioIdOrderByDataAulaDesc(
            Integer alunoId,
            Long estudioId
    );

    Optional<FichaDeAula> findByIdAndAlunoEstudioId(Integer id, Long estudioId);

}
