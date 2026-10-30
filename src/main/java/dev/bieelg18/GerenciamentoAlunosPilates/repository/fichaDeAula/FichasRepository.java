package dev.bieelg18.GerenciamentoAlunosPilates.repository.fichaDeAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FichasRepository extends JpaRepository<FichaDeAula, Integer> {
}
