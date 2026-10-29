package dev.bieelg18.GerenciamentoAlunosPilates.model.entity.anamnese;

import dev.bieelg18.GerenciamentoAlunosPilates.model.entity.aluno.Aluno;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "tb_anamnese")
public class Anamnese {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data_avaliacao", nullable = false)
    private LocalDate dataAvaliacao;

    @Column(nullable = false)
    private boolean cervicalgia = false;

    @Column(nullable = false)
    private boolean lombalgia = false;

    @Column(nullable = false)
    private boolean dorsalgia = false;

    @Column(name = "hernia_de_disco_cervical", nullable = false)
    private boolean herniaDeDiscoCervical = false;

    @Column(name = "hernia_de_disco_lombar", nullable = false)
    private boolean herniaDeDiscoLombar = false;

    @Column(name = "protrusao_discal", nullable = false)
    private boolean protrusaoDiscal = false;

    @Column(nullable = false)
    private boolean escoliose = false;

    @Column(nullable = false)
    private boolean hipercifose = false;

    @Column(nullable = false)
    private boolean hiperlordose = false;

    @Column(name = "retificacao_cervical", nullable = false)
    private boolean retificacaoCervical = false;

    @Column(name = "retificacao_lombar", nullable = false)
    private boolean retificacaoLombar = false;

    @Column(nullable = false)
    private boolean espondilolistese = false;

    @Column(name = "espondilite_anquilosante", nullable = false)
    private boolean espondiliteAnquilosante = false;

    @Column(nullable = false)
    private boolean artrose = false;

    @Column(nullable = false)
    private boolean osteoporose = false;

    @Column(nullable = false)
    private boolean fibromialgia = false;

    @Column(nullable = false)
    private boolean tendinite = false;

    @Column(nullable = false)
    private boolean bursite = false;

    @Column(name = "capsulite_adesiva", nullable = false)
    private boolean capsuliteAdesiva = false;

    @Column(name = "lesao_do_manguito_rotador", nullable = false)
    private boolean lesaoDoManguitoRotador = false;

    @Column(nullable = false)
    private boolean epicondilite = false;

    @Column(nullable = false)
    private boolean pubalgia = false;

    @Column(name = "condromalacia_patelar", nullable = false)
    private boolean condromalaciaPatelar = false;

    @Column(name = "lesao_meniscal", nullable = false)
    private boolean lesaoMeniscal = false;

    @Column(name = "lesao_de_lca", nullable = false)
    private boolean lesaoDeLCA = false;

    @Column(name = "fascite_plantar", nullable = false)
    private boolean fascitePlantar = false;

    @Column(name = "entorse_de_tornozelo", nullable = false)
    private boolean entorseDeTornozelo = false;

    @Column(name = "pe_plano", nullable = false)
    private boolean pePlano = false;

    @Column(name = "pe_cavo", nullable = false)
    private boolean peCavo = false;

    @Column(nullable = false)
    private boolean avc = false;

    @Column(name = "esclerose_multipla", nullable = false)
    private boolean escleroseMultipla = false;

    @Column(nullable = false)
    private boolean neuropatia = false;

    @Column(name = "outras_condicoes_clinicas")
    private String outrasCondicoesClinicas;

    private String cirurgias;

    @Column(name = "reducao_da_dor", nullable = false)
    private boolean reducaoDaDor = false;

    @Column(name = "correcao_postural", nullable = false)
    private boolean correcaoPostural = false;

    @Column(name = "ganho_de_forca", nullable = false)
    private boolean ganhoDeForca = false;

    @Column(name = "ganho_de_flexibilidade", nullable = false)
    private boolean ganhoDeFlexibilidade = false;

    @Column(nullable = false)
    private boolean equilibrio = false;

    @Column(name = "condicionamento_fisico", nullable = false)
    private boolean condicionamentoFisico = false;

    @Column(nullable = false)
    private boolean reabilitacao = false;

    @Column(nullable = false)
    private boolean emagrecimento = false;

    @Column(name = "qualidade_de_vida", nullable = false)
    private boolean qualidadeDeVida = false;

    @Column(name = "outros_objetivos_do_paciente")
    private String outrosObjetivosDoPaciente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Frequencia frequencia;

    private String observacoes;

    @OneToOne
    @JoinColumn(name = "aluno_id", nullable = false, unique = true)
    private Aluno aluno;

}
