package dev.bieelg18.GerenciamentoAlunosPilates.controller.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.AlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.AlunoResumoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.CriarAlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.services.aluno.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/aluno")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService service;

    //Endpoint para cadastrar um novo aluno
    @PostMapping
    public String cadastrarAluno(@RequestBody CriarAlunoDTO dto){
        return service.cadastrarAluno(dto);
    }

    //Endpoint para listar todos os alunos cadastrados
    @GetMapping("/all")
    public List<AlunoResumoDTO> listarAlunos(){
        return service.listarAlunos();
    }

    //Endpoint para buscar um aluno pelo ID
    @GetMapping("/{id}")
    public AlunoDTO alunoID(@PathVariable Integer id){
        return service.alunoID(id);
    }

    //Endpoint para listar alunos pelo nome
    @GetMapping("/buscar")
    public List<AlunoResumoDTO> alunoNome(@RequestParam String nome){
        return service.alunoNome(nome);
    }

    //Endpoint para editar dados de um aluno já cadastrado
    @PatchMapping("/{id}")
    public String editarAluno(@RequestBody CriarAlunoDTO dto, @PathVariable Integer id){
        return service.editarAluno(dto, id);
    }

    //Endpoint para deletar um aluno
    @DeleteMapping("/{id}")
    public String deletarAluno(@PathVariable Integer id){
        return service.deletarAluno(id);
    }

}
