package dev.bieelg18.GerenciamentoAlunosPilates.repository.fichaDeAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FichasRepository extends JpaRepository<FichaDeAula, Integer> {

    List<FichaDeAula> findByAlunoIdOrderByDataAulaDesc(Integer id);

}
