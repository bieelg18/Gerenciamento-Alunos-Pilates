package dev.bieelg18.GerenciamentoAlunosPilates.services.aluno;

import dev.bieelg18.GerenciamentoAlunosPilates.exception.RecursoNaoEncontradoException;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.AlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.AlunoResumoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.aluno.CriarAlunoDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Professor;
import dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.aluno.AlunoMapper;
import dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.aluno.AlunoResumoMapper;
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
    private final AlunoResumoMapper alunoResumoMapper;

    //Método para cadastrar um novo aluno
    @Transactional
    public String cadastrarAluno(CriarAlunoDTO dto, Authentication authentication){
        String email = authentication.getName();
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        Aluno aluno = criarAlunoMapper.toEntity(dto);
        aluno.setEstudio(professor.getEstudio());
        repository.save(aluno);
        return  "Aluno cadastrado com sucesso!";
    }

    //Método para listar todos os alunos cadastrados
    @Transactional(readOnly = true)
    public List<AlunoResumoDTO> listarAlunos(Authentication authentication){
        String email = authentication.getName();
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não autenticado"
                ));
        List<Aluno> alunos = repository.findAllByEstudioIdOrderByNomeAsc(professor.getEstudio().getId());
        return alunos.stream()
                .map(alunoResumoMapper::toDTO)
                .toList();
    }

    //Método para buscar um aluno pelo ID
    @Transactional(readOnly = true)
    public AlunoDTO alunoID(Integer id, Authentication authentication){
        String email = authentication.getName();
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        Long estudioId = professor.getEstudio().getId();
        Aluno aluno = repository.findByIdAndEstudioId(id,estudioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com o ID " + id + " não encontrado"
                ));
        return alunoMapper.toDTO(aluno);
    }

    //Método para buscar alunos pelo nome
    @Transactional(readOnly = true)
    public List<AlunoResumoDTO> alunoNome(String nome, Authentication authentication){
        String email = authentication.getName();
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        Long estudioId = professor.getEstudio().getId();
        List<Aluno> alunos = repository.findByEstudioIdAndNomeContainingIgnoreCaseOrderByNomeAsc(estudioId, nome);
        return alunos.stream()
                .map(alunoResumoMapper::toDTO)
                .toList();
    }

    //Método para editar dados de um aluno já cadastrado
    @Transactional
    public String editarAluno(CriarAlunoDTO dto, Integer id, Authentication authentication){
        String email = authentication.getName();
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        Long estudioId = professor.getEstudio().getId();
        Aluno aluno = repository.findByIdAndEstudioId(id, estudioId)
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
    public String deletarAluno(Integer id, Authentication authentication){
        String email = authentication.getName();
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        Long estudioId = professor.getEstudio().getId();
        Aluno aluno = repository.findByIdAndEstudioId(id, estudioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno com o ID " + id + " não encontrado"
                ));
        repository.delete(aluno);
        return "Aluno deletado com sucesso!";
    }
}
