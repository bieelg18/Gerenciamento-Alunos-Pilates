package dev.bieelg18.GerenciamentoAlunosPilates.services.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.exception.RecursoNaoEncontradoException;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.professor.AlterarSenhaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Professor;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.professor.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository repository;
    private final PasswordEncoder passwordEncoder;

    //Método para alterar a senha do professor
    @Transactional
    public String alterarSenha(Authentication authentication, AlterarSenhaDTO dto){
        String email = authentication.getName();
        Professor professor = repository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado!"
                ));
        professor.setSenhaHash(passwordEncoder.encode(dto.senha()));
        return "Senha alterada com sucesso!";
    }

}
