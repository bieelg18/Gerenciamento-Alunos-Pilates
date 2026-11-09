package dev.bieelg18.GerenciamentoAlunosPilates.controller.professor;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.professor.AlterarSenhaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.services.professor.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/professor")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService service;

    //Endpoint para alterar a senha de cadastro de um professor
    @PatchMapping("/senha")
    public String alterarSenha(Authentication authentication, @RequestBody AlterarSenhaDTO dto){
        System.out.println("CHEGOU NO CONTROLLER");
        return service.alterarSenha(authentication, dto);
    }

}
