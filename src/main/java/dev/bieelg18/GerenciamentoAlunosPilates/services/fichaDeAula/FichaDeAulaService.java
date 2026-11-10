package dev.bieelg18.GerenciamentoAlunosPilates.services.fichaDeAula;

import dev.bieelg18.GerenciamentoAlunosPilates.exception.EscalaDorException;
import dev.bieelg18.GerenciamentoAlunosPilates.exception.LocalizacaoDorChegadaException;
import dev.bieelg18.GerenciamentoAlunosPilates.exception.RecursoNaoEncontradoException;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula.CriarFichaAulaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.fichaAula.FichaDeAulaDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.EstadoDor;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.fichaAula.FichaDeAula;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Professor;
import dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.fichaAula.CriarFichaAulaMapper;
import dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.fichaAula.FichaDeAulaMapper;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.aluno.AlunoRepository;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.fichaDeAula.FichasRepository;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.professor.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FichaDeAulaService {

    private final FichasRepository repository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final CriarFichaAulaMapper criarFichaAulaMapper;
    private final FichaDeAulaMapper fichaDeAulaMapper;

    //Método para criar uma nova ficha de aula
    @Transactional
    public FichaDeAulaDTO criarFichaDeAula(Authentication authentication, CriarFichaAulaDTO dto){
        String email = authentication.getName();
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor não autenticado não encontrado"
                ));
        Aluno aluno = alunoRepository.findByIdAndEstudioId(dto.alunoId(), professor.getEstudio().getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno não encontrado"
                ));
        FichaDeAula ficha = criarFichaAulaMapper.toEntity(dto);
        ficha.setAluno(aluno);
        ficha.setProfessor(professor);
        if (dto.condicaoDorChegada() == EstadoDor.SEM_DOR){
            ficha.setEscalaDor(null);
            ficha.setLocalizacaoDorChegada(null);
        }else if (dto.condicaoDorChegada() == EstadoDor.COM_DOR){
            if (dto.escalaDor() == null || dto.escalaDor() < 1 || dto.escalaDor() > 10){
                throw new EscalaDorException(
                        "A escala de dor deve estar entre 1 e 10"
                );
            }
            if (dto.localizacaoDorChegada() == null || dto.localizacaoDorChegada().isBlank()){
                throw new LocalizacaoDorChegadaException(
                        "A localização da dor deve ser informada"
                );
            }
        }
        FichaDeAula fichaSalva = repository.save(ficha);
        return fichaDeAulaMapper.toDTO(fichaSalva);
    }

    //Método para listar todas as fichas de aula do aluno
    @Transactional(readOnly = true)
    public List<FichaDeAulaDTO> listarFichasDeAula(Integer alunoId, Authentication authentication){
        Professor professor = professorRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        List<FichaDeAula> fichas = repository.findByAlunoIdAndAlunoEstudioIdOrderByDataAulaDesc(alunoId, professor.getEstudio().getId());
        return fichas.stream()
                .map(fichaDeAulaMapper::toDTO)
                .toList();
    }

    //Método para buscar uma ficha de aula pelo id
    @Transactional(readOnly = true)
    public FichaDeAulaDTO fichaAulaID(Integer id, Authentication authentication){
        Professor professor = professorRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        FichaDeAula ficha = repository.findByIdAndAlunoEstudioId(id, professor.getEstudio().getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Ficha de aula não encontrada"
                ));
        return fichaDeAulaMapper.toDTO(ficha);
    }

    //Método para editar uma ficha de aluna do aluno
    @Transactional
    public FichaDeAulaDTO editarFichaAula(Integer id, CriarFichaAulaDTO dto, Authentication authentication) {
        Professor professor = professorRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        FichaDeAula ficha = repository.findByIdAndAlunoEstudioId(id, professor.getEstudio().getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Ficha de aula não encontrada"
                ));
        fichaDeAulaMapper.atualizar(dto, ficha);
        if (dto.condicaoDorChegada() == EstadoDor.SEM_DOR) {
            ficha.setEscalaDor(null);
            ficha.setLocalizacaoDorChegada(null);
        } else if (dto.condicaoDorChegada() == EstadoDor.COM_DOR) {
            if (dto.escalaDor() == null || dto.escalaDor() < 1 || dto.escalaDor() > 10) {
                throw new EscalaDorException(
                        "A escala de dor deve estar entre 1 e 10"
                );
            }
            if (dto.localizacaoDorChegada() == null || dto.localizacaoDorChegada().isBlank()) {
                throw new LocalizacaoDorChegadaException(
                        "A localização da dor deve ser informada"
                );
            }
        }
        return fichaDeAulaMapper.toDTO(ficha);
    }

    //Método para deletar uma ficha de aula de um aluno
    @Transactional
    public String deletarFichaAula(Integer id, Authentication authentication){
        Professor professor = professorRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        FichaDeAula ficha = repository.findByIdAndAlunoEstudioId(id, professor.getEstudio().getId())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Ficha de aula não encontrada"
                ));
        repository.delete(ficha);
        return "Ficha de aula excluida com sucesso!";
    }
}
