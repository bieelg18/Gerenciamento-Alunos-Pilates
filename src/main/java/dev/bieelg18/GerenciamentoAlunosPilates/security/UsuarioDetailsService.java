package dev.bieelg18.GerenciamentoAlunosPilates.security;

import dev.bieelg18.GerenciamentoAlunosPilates.repository.professor.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioDetailsService implements UserDetailsService {

    private final ProfessorRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        return repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuário não encontrado"
                ));
    }

}
