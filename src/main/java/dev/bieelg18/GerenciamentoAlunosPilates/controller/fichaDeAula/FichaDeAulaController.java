package dev.bieelg18.GerenciamentoAlunosPilates.controller.fichaDeAula;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula.CriarFichaAulaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula.FichaDeAulaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import dev.bieelg18.GerenciamentoAlunosPilates.services.fichaDeAula.FichaDeAulaService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ficha-aula")
@RequiredArgsConstructor
public class FichaDeAulaController {

    private final FichaDeAulaService service;

    //Endpoint para criar uma nova ficha de aula
    @PostMapping
    public FichaDeAulaDTO criarFichaDeAula(Authentication authentication, @RequestBody CriarFichaAulaDTO dto){
        return service.criarFichaDeAula(authentication, dto);
    }

    //Endpoint para listar todas as fichas de aula de um aluno
    @GetMapping("/aluno/{id}/all")
    public List<FichaDeAulaDTO> listarFichasDeAula(@PathVariable Integer idAluno){
        return service.listarFichasDeAula(idAluno);
    }

    //Endpoint para retornar uma ficha de aula pelo id
    @GetMapping("/aluno/{id}")
    public FichaDeAulaDTO fichaAulaID(@PathVariable Integer id){
        return service.fichaAulaID(id);
    }

    //Endpoint para editar uma ficha de aula já existente
    @PutMapping("/{id}")
    public FichaDeAulaDTO editarFichaAula(@PathVariable Integer id, @RequestBody CriarFichaAulaDTO dto){
        return service.editarFichaAula(id, dto);
    }

    //Endpoint para deletar uma ficha de aula
    @DeleteMapping("/{id}")
    public String deletarFichaAula(@PathVariable Integer id){
        return service.deletarFichaAula(id);
    }

}
