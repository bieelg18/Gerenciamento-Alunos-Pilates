package dev.bieelg18.GerenciamentoAlunosPilates.services.anamnese;

import dev.bieelg18.GerenciamentoAlunosPilates.exception.RecursoNaoEncontradoException;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.anamnese.AnamneseDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.anamnese.CriarAnamneseDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.dto.anamnese.EditarAnamneseDTO;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.anamnese.Anamnese;
import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.professor.Professor;
import dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.anamnese.AnamneseMapper;
import dev.bieelg18.GerenciamentoAlunosPilates.model.mapper.anamnese.CriarAnamneseMapper;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.aluno.AlunoRepository;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.anamnese.AnamneseRepository;
import dev.bieelg18.GerenciamentoAlunosPilates.repository.professor.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AnamneseService {

    private final AnamneseRepository repository;
    private final ProfessorRepository professorRepository;
    private final CriarAnamneseMapper criarAnamneseMapper;
    private final AnamneseMapper anamneseMapper;
    private final AlunoRepository alunoRepository;

    //Método para criar uma ficha de anamnese
    @Transactional
    public String criarAnamnese(Authentication authentication, CriarAnamneseDTO dto){
        String email = authentication.getName();
        Professor professor = professorRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Professor autenticado não encontrado"
                ));
        Aluno aluno = alunoRepository.findById(dto.alunoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Aluno não encontrado"
                ));
        Anamnese anamnese = criarAnamneseMapper.toEntity(dto);
        anamnese.setAluno(aluno);
        anamnese.setProfessor(professor);
        repository.save(anamnese);
        return "Ficha de anamnese criada com sucesso!";
    }

    //Método para bsucar a ficha de anamnese de um aluno
    @Transactional(readOnly = true)
    public AnamneseDTO buscarFichaAluno(Integer idAluno){
        Anamnese anamnese = repository.findByAlunoId(idAluno)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Anamnese não encontrada para o aluno informado"
                ));
        return anamneseMapper.toDTO(anamnese);
    }

    //Método para editar uma ficha de anamnese já existente
    @Transactional
    public String editarAnamnese(EditarAnamneseDTO dto, Integer id){
        Anamnese anamnese = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Ficha de anamnese não encontrada"
                ));
        if (dto.dataAvaliacao() != null){
            anamnese.setDataAvaliacao(dto.dataAvaliacao());
        }
        anamnese.setCervicalgia(dto.cervicalgia());
        anamnese.setLombalgia(dto.lombalgia());
        anamnese.setDorsalgia(dto.dorsalgia());
        anamnese.setHerniaDeDiscoCervical(dto.herniaDeDiscoCervical());
        anamnese.setHerniaDeDiscoLombar(dto.herniaDeDiscoLombar());
        anamnese.setProtrusaoDiscal(dto.protrusaoDiscal());
        anamnese.setEscoliose(dto.escoliose());
        anamnese.setHipercifose(dto.hipercifose());
        anamnese.setHiperlordose(dto.hiperlordose());
        anamnese.setRetificacaoCervical(dto.retificacaoCervical());
        anamnese.setRetificacaoLombar(dto.retificacaoLombar());
        anamnese.setEspondilolistese(dto.espondilolistese());
        anamnese.setEspondiliteAnquilosante(dto.espondiliteAnquilosante());
        anamnese.setArtrose(dto.artrose());
        anamnese.setOsteoporose(dto.osteoporose());
        anamnese.setFibromialgia(dto.fibromialgia());
        anamnese.setTendinite(dto.tendinite());
        anamnese.setBursite(dto.bursite());
        anamnese.setCapsuliteAdesiva(dto.capsuliteAdesiva());
        anamnese.setLesaoDoManguitoRotador(dto.lesaoDoManguitoRotador());
        anamnese.setEpicondilite(dto.epicondilite());
        anamnese.setPubalgia(dto.pubalgia());
        anamnese.setCondromalaciaPatelar(dto.condromalaciaPatelar());
        anamnese.setLesaoMeniscal(dto.lesaoMeniscal());
        anamnese.setLesaoDeLCA(dto.lesaoDeLCA());
        anamnese.setFascitePlantar(dto.fascitePlantar());
        anamnese.setEntorseDeTornozelo(dto.entorseDeTornozelo());
        anamnese.setPePlano(dto.pePlano());
        anamnese.setPeCavo(dto.peCavo());
        anamnese.setAvc(dto.avc());
        anamnese.setEscleroseMultipla(dto.escleroseMultipla());
        anamnese.setNeuropatia(dto.neuropatia());
        if (dto.outrasCondicoesClinicas() != null){
            anamnese.setOutrasCondicoesClinicas(dto.outrasCondicoesClinicas());
        }
        if (dto.cirurgias() != null){
            anamnese.setCirurgias(dto.cirurgias());
        }
        anamnese.setReducaoDaDor(dto.reducaoDaDor());
        anamnese.setCorrecaoPostural(dto.correcaoPostural());
        anamnese.setGanhoDeForca(dto.ganhoDeForca());
        anamnese.setGanhoDeFlexibilidade(dto.ganhoDeFlexibilidade());
        anamnese.setEquilibrio(dto.equilibrio());
        anamnese.setCondicionamentoFisico(dto.condicionamentoFisico());
        anamnese.setReabilitacao(dto.reabilitacao());
        anamnese.setEmagrecimento(dto.emagrecimento());
        anamnese.setQualidadeDeVida(dto.qualidadeDeVida());
        if (dto.outrosObjetivosDoPaciente() != null){
            anamnese.setOutrosObjetivosDoPaciente(dto.outrosObjetivosDoPaciente());
        }
        if (dto.frequencia() != null){
            anamnese.setFrequencia(dto.frequencia());
        }
        if (dto.observacoes() != null){
            anamnese.setObservacoes(dto.observacoes());
        }
        return "Ficha de anamnese editada com sucesso!";
    }

    //Método para deletar uma ficha de anamnese
    @Transactional
    public String deletarAnamnese(Integer id){
        Anamnese anamnese = repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Ficha de anamnese não encontrada"
                ));
        repository.delete(anamnese);
        return "Ficha de anamnese deletada com sucesso!";
    }

}
