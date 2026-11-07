package dev.bieelg18.GerenciamentoAlunosPilates.auth;

import dev.bieelg18.GerenciamentoAlunosPilates.repository.professor.ProfessorRepository;
import dev.bieelg18.GerenciamentoAlunosPilates.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final ProfessorRepository repository;
    private final JwtService service;

    @PostMapping("/login")
    public TokenDTO login(@RequestBody LoginDTO dto){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.email(),
                        dto.senha()
                )
        );
        UserDetails usuario = repository.findByEmail(dto.email())
                .orElseThrow();
        String token = service.gerarToken(usuario);
        return new TokenDTO(token);
    }

}
