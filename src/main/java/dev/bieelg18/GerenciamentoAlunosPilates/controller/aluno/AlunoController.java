package dev.bieelg18.GerenciamentoAlunosPilates.controller.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.AlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.AlunoResumoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.CriarAlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.services.aluno.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aluno")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService service;

    //Endpoint para cadastrar um novo aluno
    @PostMapping
    public String cadastrarAluno(@RequestBody CriarAlunoDTO dto, Authentication authentication){
        return service.cadastrarAluno(dto, authentication);
    }

    //Endpoint para listar todos os alunos cadastrados
    @GetMapping("/all")
    public List<AlunoResumoDTO> listarAlunos(Authentication authentication){
        return service.listarAlunos(authentication);
    }

    //Endpoint para buscar um aluno pelo ID
    @GetMapping("/{id}")
    public AlunoDTO alunoID(@PathVariable Integer id, Authentication authentication){
        return service.alunoID(id, authentication);
    }

    //Endpoint para listar alunos pelo nome
    @GetMapping("/buscar")
    public List<AlunoResumoDTO> alunoNome(@RequestParam String nome, Authentication authentication){
        return service.alunoNome(nome, authentication);
    }

    //Endpoint para editar dados de um aluno já cadastrado
    @PatchMapping("/{id}")
    public String editarAluno(@RequestBody CriarAlunoDTO dto, @PathVariable Integer id, Authentication authentication){
        return service.editarAluno(dto, id, authentication);
    }

    //Endpoint para deletar um aluno
    @DeleteMapping("/{id}")
    public String deletarAluno(@PathVariable Integer id, Authentication authentication){
        return service.deletarAluno(id, authentication);
    }

}
