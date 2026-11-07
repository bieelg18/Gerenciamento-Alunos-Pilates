package dev.bieelg18.GerenciamentoAlunosPilates.controller.anamnese;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.anamnese.AnamneseDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.anamnese.CriarAnamneseDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.anamnese.EditarAnamneseDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.services.anamnese.AnamneseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/anamnese")
@RequiredArgsConstructor
public class AnamneseController {

    private final AnamneseService service;

    //Endpoint para criar uma ficha de anamnese
    @PostMapping
    public String criarAnamnese(Authentication authentication, @RequestBody CriarAnamneseDTO dto){
        return service.criarAnamnese(authentication, dto);
    }

    //Endpoint para buscar uma ficha de anamnese de um aluno pelo id do aluno
    @GetMapping("/aluno/{id}")
    public AnamneseDTO buscarFichaAluno(@PathVariable Integer idAluno){
        return service.buscarFichaAluno(idAluno);
    }

    //Endpoint para editar uma ficha de anamnese já existente
    @PatchMapping("/{id}")
    public String editarAnamnese(@RequestBody EditarAnamneseDTO dto, @PathVariable Integer id){
        return service.editarAnamnese(dto, id);
    }

    //Endpoint para deletar uma ficha de anamnese
    @DeleteMapping("/{id}")
    public String deletarAnamnese(@PathVariable Integer id){
        return service.deletarAnamnese(id);
    }

}
