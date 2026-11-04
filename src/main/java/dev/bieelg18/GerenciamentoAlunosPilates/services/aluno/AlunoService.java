package dev.bieelg18.GerenciamentoAlunosPilates.services.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.exception.RecursoNaoEncontradoException;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.AlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.CriarAlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.aluno.AlunoMapper;
import dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.aluno.CriarAlunoMapper;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.aluno.AlunoRepository;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.professor.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository repository;
    private final ProfessorRepository professorRepository;
    private final CriarAlunoMapper criarAlunoMapper;
    private final AlunoMapper alunoMapper;

    //Método para cadastrar um novo aluno
    @Transactional
    public String cadastrarAluno(CriarAlunoDTO dto){
        Aluno aluno = criarAlunoMapper.toEntity(dto);
        repository.save(aluno);
        return  "Aluno cadastrado com sucesso!";
    }

    //Método para listar todos os alunos cadastrados
    @Transactional(readOnly = true)
    public List<AlunoDTO> listarAlunos(){
        List<Aluno> alunos = repository.findAll();
        return alunos.stream()
                .map(alunoMapper::toDTO)
                .toList();
    }

    //Método para buscar um aluno pelo ID
    @Transactional(readOnly = true)
    public AlunoDTO alunoID(Integer id){
        Aluno aluno = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com o ID " + id + " não encontrado"
                ));
        return alunoMapper.toDTO(aluno);
    }

    //Método para buscar alunos pelo nome
    @Transactional(readOnly = true)
    public List<AlunoDTO> alunoNome(String nome){
        List<Aluno> alunos = repository.findByNomeContainingIgnoreCase(nome);
        return alunos.stream()
                .map(alunoMapper::toDTO)
                .toList();
    }

    //Método para editar dados de um aluno já cadastrado
    @Transactional
    public String editarAluno(CriarAlunoDTO dto, Integer id){
        Aluno aluno = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com o ID " + id + " não encontrado"
                ));
        if (dto.nome() != null){
            aluno.setNome(dto.nome());
        }
        if (dto.dataNascimento() != null){
            aluno.setDataNascimento(dto.dataNascimento());
        }
        if (dto.sexo() != null){
            aluno.setSexo(dto.sexo());
        }
        if (dto.profissao() != null){
            aluno.setProfissao(dto.profissao());
        }
        if (dto.patologia() != null){
            aluno.setPatologia(dto.patologia());
        }
        return "Dados editados com sucesso!";
    }

    //Método para deletar um aluno
    @Transactional
    public String deletarAluno(Integer id){
        Aluno aluno = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com o ID " + id + " não encontrado"
                ));
        repository.delete(aluno);
        return "Aluno deletado com sucesso!";
    }
}
