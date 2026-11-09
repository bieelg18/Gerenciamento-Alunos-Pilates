package dev.bieelg18.GerenciamentoAlunosPilates.controller.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.professor.AlterarSenhaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.services.professor.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/professor")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService service;

    //Endpoint para alterar a senha de cadastro de um professor
    public String alterarSenha(Authentication authentication, AlterarSenhaDTO dto){
        return service.alterarSenha(authentication, dto);
    }

}
