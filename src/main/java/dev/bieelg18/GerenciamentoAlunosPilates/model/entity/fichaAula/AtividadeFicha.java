package dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class AtividadeFicha {

    @Enumerated(EnumType.STRING)
    @Column(name = "regiao_corporal", nullable = false)
    private RegiaoCorporal regiaoCorporal;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_atividade", nullable = false)
    private TipoAtividade tipoAtividade;

}
