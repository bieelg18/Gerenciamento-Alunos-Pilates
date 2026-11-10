document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    window.location.replace("/login.html");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const alunoId = params.get("id");

  const editModal = document.querySelector("#edit-modal");
  const deleteModal = document.querySelector("#delete-modal");
  const infoModal = document.querySelector("#info-modal");
  const anamneseModal = document.querySelector("#anamnese-view-modal");

  const form = document.querySelector("#edit-form");

  const anamneseButton = document.querySelector('[data-placeholder="anamnese"]');

  let alunoAtual = null;
  let anamneseAtual = null;

  if (!alunoId || !/^\d+$/.test(alunoId)) {
    showPageError("Identificação do aluno inválida.");
    return;
  }

  const $ = selector => document.querySelector(selector);

  const text = (selector, value) => {
    $(selector).textContent = value || "Não informado";
  };

  function showPageError(message) {
    $("#student-name").textContent = "Não foi possível carregar o aluno";
    $("#student-profession").textContent = message;
    $("#edit-button").disabled = true;
    $("#delete-button").disabled = true;
  }

  function initials(name = "") {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (!words.length) return "--";

    return (
        words.length === 1
            ? words[0].slice(0, 2)
            : words[0][0] + words.at(-1)[0]
    ).toUpperCase();
  }

  function formatDate(value) {
    if (!value) return "Não informado";

    const parts = value.split("-");

    return parts.length === 3
        ? `${parts[2]}/${parts[1]}/${parts[0]}`
        : value;
  }

  function displayAluno(aluno) {
    alunoAtual = aluno;

    $("#student-avatar").textContent = initials(aluno.nome);
    text("#student-name", aluno.nome);
    text("#student-profession", aluno.profissao);
    text("#student-birth", formatDate(aluno.dataNascimento));

    text(
        "#student-sex",
        aluno.sexo === "M"
            ? "Masculino"
            : aluno.sexo === "F"
                ? "Feminino"
                : "Não informado"
    );

    text("#student-phone", aluno.telefone);
    text("#student-job", aluno.profissao);
    text("#student-pathology", aluno.patologia);

    $("#edit-button").disabled = false;
    $("#delete-button").disabled = false;

    $("#delete-student-name").textContent = aluno.nome || "este aluno";

    document.title = `${aluno.nome || "Aluno"} | Movimento+`;
  }

  async function carregarAluno() {
    try {
      const response = await API.request(
          `/aluno/${encodeURIComponent(alunoId)}`
      );

      if (!response.ok) {
        throw new Error("Não foi possível consultar os dados deste aluno.");
      }

      displayAluno(await response.json());

    } catch (error) {
      if (error.message !== "Sua sessão expirou. Entre novamente.") {
        showPageError(error.message);
      }
    }
  }

  // =====================================================
  // ANAMNESE
  // =====================================================

  const condicoesClinicas = {
    cervicalgia: "Cervicalgia",
    lombalgia: "Lombalgia",
    dorsalgia: "Dorsalgia",
    herniaDeDiscoCervical: "Hérnia de disco cervical",
    herniaDeDiscoLombar: "Hérnia de disco lombar",
    protrusaoDiscal: "Protusão discal",
    escoliose: "Escoliose",
    hipercifose: "Hipercifose",
    hiperlordose: "Hiperlordose",
    retificacaoCervical: "Retificação cervical",
    retificacaoLombar: "Retificação lombar",
    espondilolistese: "Espondilolistese",
    espondiliteAnquilosante: "Espondilite anquilosante",
    artrose: "Artrose",
    osteoporose: "Osteoporose",
    fibromialgia: "Fibromialgia",
    tendinite: "Tendinite",
    bursite: "Bursite",
    capsuliteAdesiva: "Capsulite adesiva",
    lesaoDoManguitoRotador: "Lesão do manguito rotador",
    epicondilite: "Epicondilite",
    pubalgia: "Pubalgia",
    condromalaciaPatelar: "Condromalácia patelar",
    lesaoMeniscal: "Lesão meniscal",
    lesaoDeLCA: "Lesão de LCA",
    fascitePlantar: "Fascite plantar",
    entorseDeTornozelo: "Entorse de tornozelo",
    pePlano: "Pé plano",
    peCavo: "Pé cavo",
    avc: "AVC",
    escleroseMultipla: "Esclerose múltipla",
    neuropatia: "Neuropatia"
  };

  const objetivos = {
    reducaoDaDor: "Redução da dor",
    correcaoPostural: "Correção postural",
    ganhoDeForca: "Ganho de força",
    ganhoDeFlexibilidade: "Ganho de flexibilidade",
    equilibrio: "Equilíbrio",
    condicionamentoFisico: "Condicionamento físico",
    reabilitacao: "Reabilitação",
    emagrecimento: "Emagrecimento",
    qualidadeDeVida: "Qualidade de vida"
  };

  const frequencias = {
    UMA_VEZ_POR_SEMANA: "1 vez por semana",
    DUAS_VEZES_POR_SEMANA: "2 vezes por semana",
    TRES_VEZES_POR_SEMANA: "3 vezes por semana",
    QUATRO_VEZES_POR_SEMANA: "4 vezes por semana",
    CINCO_VEZES_POR_SEMANA: "5 vezes por semana",
    SEIS_VEZES_POR_SEMANA: "6 vezes por semana"
  };

  async function carregarAnamnese() {
    anamneseButton.disabled = true;

    try {
      const response = await API.request(
          `/anamnese/aluno/${encodeURIComponent(alunoId)}`
      );

      if (response.status === 404) {
        anamneseAtual = null;
        atualizarBotaoAnamnese();
        return;
      }

      if (!response.ok) {
        throw new Error("Não foi possível consultar a ficha de anamnese.");
      }

      anamneseAtual = await response.json();

      atualizarBotaoAnamnese();

    } catch (error) {
      anamneseButton.querySelector("strong").textContent =
          "Anamnese indisponível";

      anamneseButton.querySelector("small").textContent =
          "Não foi possível consultar a ficha";

      console.error("Erro ao carregar anamnese:", error);

    } finally {
      anamneseButton.disabled = false;
    }
  }

  function atualizarBotaoAnamnese() {
    const titulo = anamneseButton.querySelector("strong");
    const descricao = anamneseButton.querySelector("small");

    if (anamneseAtual) {
      titulo.textContent = "Ver ficha de anamnese";
      descricao.textContent = "Consultar informações registradas do aluno";
    } else {
      titulo.textContent = "Preencher ficha anamnese";
      descricao.textContent = "Registrar informações iniciais do aluno";
    }
  }

  function adicionarSecao(container, titulo, campos) {
    const selecionados = Object.entries(campos)
        .filter(([campo]) => anamneseAtual[campo] === true)
        .map(([, label]) => label);

    if (!selecionados.length) return;

    const section = document.createElement("section");
    section.className = "anamnese-view-section";

    const heading = document.createElement("h3");
    heading.textContent = titulo;

    const list = document.createElement("div");
    list.className = "anamnese-view-list";

    selecionados.forEach(label => {
      const item = document.createElement("div");
      item.className = "anamnese-view-item";
      item.textContent = label;
      list.appendChild(item);
    });

    section.append(heading, list);
    container.appendChild(section);
  }

  function adicionarTexto(container, titulo, valor) {
    if (!valor || !String(valor).trim()) return;

    const section = document.createElement("section");
    section.className = "anamnese-view-section";

    const heading = document.createElement("h3");
    heading.textContent = titulo;

    const paragraph = document.createElement("p");
    paragraph.className = "anamnese-view-text";
    paragraph.textContent = valor;

    section.append(heading, paragraph);
    container.appendChild(section);
  }

  function abrirAnamnese() {
    if (!anamneseAtual) return;

    const content = $("#anamnese-view-content");

    content.innerHTML = "";

    $("#anamnese-view-date").textContent =
        `Avaliação realizada em ${formatDate(anamneseAtual.dataAvaliacao)}`;

    const turnoProfessor = {
      MANHA: "Manhã",
      TARDE: "Tarde"
    };

    adicionarTexto(
        content,
        "Preenchido por",
        anamneseAtual.nomeProfessor
    );

    adicionarTexto(
        content,
        "Turno",
        turnoProfessor[anamneseAtual.turno] || anamneseAtual.turno
    );

    adicionarSecao(
        content,
        "Condições clínicas",
        condicoesClinicas
    );

    adicionarTexto(
        content,
        "Outras condições clínicas",
        anamneseAtual.outrasCondicoesClinicas
    );

    adicionarTexto(
        content,
        "Cirurgias",
        anamneseAtual.cirurgias
    );

    adicionarSecao(
        content,
        "Objetivos do paciente",
        objetivos
    );

    adicionarTexto(
        content,
        "Outros objetivos",
        anamneseAtual.outrosObjetivosDoPaciente
    );

    if (anamneseAtual.frequencia) {
      adicionarTexto(
          content,
          "Frequência semanal",
          frequencias[anamneseAtual.frequencia] ||
          anamneseAtual.frequencia
      );
    }

    adicionarTexto(
        content,
        "Observações",
        anamneseAtual.observacoes
    );

    if (!content.children.length) {
      const empty = document.createElement("p");
      empty.className = "modal-description";
      empty.textContent = "Nenhuma informação foi registrada nesta ficha.";

      content.appendChild(empty);
    }

    anamneseModal.showModal();
  }

  anamneseButton.addEventListener("click", () => {
    if (anamneseAtual) {
      abrirAnamnese();
      return;
    }

    window.location.href =
        `/alunos/anamnese-nova.html?id=${encodeURIComponent(alunoId)}`;
  });

  // =====================================================
  // EDIÇÃO DO ALUNO
  // =====================================================

  function openEditModal() {
    if (!alunoAtual) return;

    form.elements.nome.value = alunoAtual.nome || "";
    form.elements.dataNascimento.value = alunoAtual.dataNascimento || "";
    form.elements.sexo.value = alunoAtual.sexo || "";
    form.elements.telefone.value = alunoAtual.telefone || "";
    form.elements.profissao.value = alunoAtual.profissao || "";
    form.elements.patologia.value = alunoAtual.patologia || "";

    $("#edit-error").textContent = "";

    editModal.showModal();
  }

  $("#edit-button").addEventListener("click", openEditModal);

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!alunoAtual) return;

    const saveButton = $("#save-button");

    saveButton.disabled = true;
    saveButton.textContent = "Salvando...";
    $("#edit-error").textContent = "";

    const payload = {
      nome: form.elements.nome.value.trim(),
      dataNascimento: form.elements.dataNascimento.value,
      sexo: form.elements.sexo.value,
      telefone: form.elements.telefone.value.trim(),
      profissao: form.elements.profissao.value.trim(),
      patologia: form.elements.patologia.value.trim()
    };

    try {
      const response = await API.request(
          `/aluno/${encodeURIComponent(alunoId)}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload)
          }
      );

      if (!response.ok) {
        let message = "Não foi possível salvar as alterações.";

        try {
          const data = await response.json();
          message = data.message || data.mensagem || data.erro || message;
        } catch {}

        throw new Error(message);
      }

      displayAluno({ ...alunoAtual, ...payload });

      editModal.close();

    } catch (error) {
      if (error.message !== "Sua sessão expirou. Entre novamente.") {
        $("#edit-error").textContent = error.message;
      }

    } finally {
      saveButton.disabled = false;
      saveButton.textContent = "Salvar alterações";
    }
  });

  // =====================================================
  // EXCLUSÃO DO ALUNO
  // =====================================================

  $("#delete-button").addEventListener("click", () => {
    $("#delete-error").textContent = "";
    deleteModal.showModal();
  });

  $("#confirm-delete").addEventListener("click", async () => {
    const button = $("#confirm-delete");

    button.disabled = true;
    button.textContent = "Excluindo...";

    $("#delete-error").textContent = "";

    try {
      const response = await API.request(
          `/aluno/${encodeURIComponent(alunoId)}`,
          { method: "DELETE" }
      );

      if (!response.ok) {
        let message = "Não foi possível excluir o aluno.";

        try {
          const data = await response.json();
          message = data.message || data.mensagem || data.erro || message;
        } catch {}

        throw new Error(message);
      }

      window.location.replace("/alunos.html");

    } catch (error) {
      if (error.message !== "Sua sessão expirou. Entre novamente.") {
        $("#delete-error").textContent = error.message;
      }

    } finally {
      button.disabled = false;
      button.textContent = "Sim, excluir";
    }
  });


  // =====================================================
// DEMAIS AÇÕES
// =====================================================

  document.querySelectorAll('[data-placeholder]:not([data-placeholder="anamnese"])')
      .forEach(button => {
        button.addEventListener("click", () => {
          const action = button.dataset.placeholder;

          if (action === "nova-ficha") {
            window.location.href =
                `/alunos/ficha-aula-nova.html?id=${encodeURIComponent(alunoId)}`;
            return;
          }

          if (action === "fichas") {
            window.location.href =
                `/alunos/fichas-aula.html?id=${encodeURIComponent(alunoId)}`;
            return;
          }

          infoModal.showModal();
        });
      });

  // =====================================================
  // MENU E SESSÃO
  // =====================================================

  const menuToggle = $("#menu-toggle");
  const mobileMenu = $("#mobile-menu");

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!open));
    menuToggle.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");

    mobileMenu.hidden = open;
  });

  document.querySelectorAll('[data-action="logout"]').forEach(button => {
    button.addEventListener("click", () => API.logout());
  });

  document.querySelectorAll('[data-action="change-password"]').forEach(button => {
    button.addEventListener("click", () => {
      mobileMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");

      $("#change-password-dialog").showModal();
    });
  });

  // =====================================================
// FECHAMENTO DOS MODAIS
// =====================================================

  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
      const modal = button.closest("dialog");

      if (modal && modal.open) {
        modal.close();
      }
    });
  });

  // Carregamento inicial
  carregarAluno();
  carregarAnamnese();
});