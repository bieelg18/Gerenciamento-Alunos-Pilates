package dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.anamnese.Anamnese;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "tb_professor")
public class Professor implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Turno turno;

    @Column(nullable = false)
    private boolean ativo = true;

    @OneToMany(mappedBy = "professor")
    private List<FichaDeAula> fichaDeAulas;

    @OneToMany(mappedBy = "professor")
    private List<Anamnese> anamnese;

    @Override
    public String getPassword(){
        return senhaHash;
    }

    @Override
    public String getUsername(){
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return List.of();
    }

    @Override
    public boolean isEnabled(){
        return ativo;
    }

}
