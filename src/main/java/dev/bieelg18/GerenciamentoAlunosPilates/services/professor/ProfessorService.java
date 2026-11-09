package dev.bieelg18.GerenciamentoAlunosPilates.services.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.exception.RecursoNaoEncontradoException;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.professor.AlterarSenhaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Professor;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.professor.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository repository;
    private final PasswordEncoder passwordEncoder;

    //Método para alterar a senha do professor
    @Transactional
    public String alterarSenha(Authentication authentication, AlterarSenhaDTO dto) {

        System.out.println("=== ALTERAÇÃO DE SENHA ===");

        String email = authentication.getName();
        System.out.println("Email autenticado: " + email);

        Professor professor = repository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));

        System.out.println("Professor encontrado: " + professor.getEmail());

        boolean senhaCorreta = passwordEncoder.matches(
                dto.senhaAtual(),
                professor.getSenhaHash()
        );

        System.out.println("Senha atual confere: " + senhaCorreta);

        if (!senhaCorreta) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A senha atual está incorreta"
            );
        }

        professor.setSenhaHash(passwordEncoder.encode(dto.novaSenha()));

        repository.save(professor);

        System.out.println("Nova senha salva!");

        return "Senha alterada com sucesso!";
    }

}
