
(() => {

  const params = new URLSearchParams(location.search);
  const alunoId = Number(params.get("id"));

  const form = document.getElementById("anamnese-form");
  const errorBox = document.getElementById("form-error");
  const saveButton = document.getElementById("save-button");
  const studentName = document.getElementById("student-name");
  const dataAvaliacao = document.getElementById("dataAvaliacao");

  // Modal de sucesso
  const successModal = document.getElementById("success-modal");
  const successBackButton = document.getElementById("success-back-button");

  const profileUrl = `/alunos/detalhes.html?id=${encodeURIComponent(alunoId)}`;

  // Preenche automaticamente a data atual.
  const today = new Date();

  dataAvaliacao.value = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
  ).toISOString().slice(0, 10);

  document.getElementById("back-link").href = profileUrl;
  document.getElementById("cancel-link").href = profileUrl;

  // Valida o ID do aluno.
  if (!Number.isInteger(alunoId) || alunoId <= 0) {

    studentName.textContent = "Aluno não identificado";

    showError(
        "ID do aluno ausente ou inválido. Volte ao perfil e tente novamente."
    );

    saveButton.disabled = true;

    return;
  }

  // Botão para voltar ao perfil após o sucesso.
  successBackButton.addEventListener("click", () => {
    location.replace(profileUrl);
  });

  loadStudent();

  // Busca os dados do aluno.
  async function loadStudent() {

    try {

      const response = await API.request(`/aluno/${alunoId}`);

      if (!response.ok) {
        throw new Error(
            await readMessage(
                response,
                "Não foi possível carregar o aluno."
            )
        );
      }

      const aluno = await response.json();

      studentName.textContent = aluno.nome || `Aluno #${alunoId}`;

    } catch (error) {

      studentName.textContent = `Aluno #${alunoId}`;

      showError(
          error.message || "Não foi possível carregar os dados do aluno."
      );

    }

  }

  // Envio do formulário.
  form.addEventListener("submit", async event => {

    event.preventDefault();

    errorBox.textContent = "";

    if (!form.reportValidity()) {
      return;
    }

    // Todos os campos booleanos do DTO.
    const booleanFields = [

      "cervicalgia",
      "lombalgia",
      "dorsalgia",
      "herniaDeDiscoCervical",
      "herniaDeDiscoLombar",
      "protrusaoDiscal",
      "escoliose",
      "hipercifose",
      "hiperlordose",
      "retificacaoCervical",
      "retificacaoLombar",
      "espondilolistese",
      "espondiliteAnquilosante",
      "artrose",
      "osteoporose",
      "fibromialgia",
      "tendinite",
      "bursite",
      "capsuliteAdesiva",
      "lesaoDoManguitoRotador",
      "epicondilite",
      "pubalgia",
      "condromalaciaPatelar",
      "lesaoMeniscal",
      "lesaoDeLCA",
      "fascitePlantar",
      "entorseDeTornozelo",
      "pePlano",
      "peCavo",
      "avc",
      "escleroseMultipla",
      "neuropatia",

      "reducaoDaDor",
      "correcaoPostural",
      "ganhoDeForca",
      "ganhoDeFlexibilidade",
      "equilibrio",
      "condicionamentoFisico",
      "reabilitacao",
      "emagrecimento",
      "qualidadeDeVida"

    ];

    const fd = new FormData(form);

    // Montagem do DTO.
    const payload = {

      dataAvaliacao: fd.get("dataAvaliacao"),

      outrasCondicoesClinicas:
          (fd.get("outrasCondicoesClinicas") || "").trim(),

      cirurgias:
          (fd.get("cirurgias") || "").trim(),

      outrosObjetivosDoPaciente:
          (fd.get("outrosObjetivosDoPaciente") || "").trim(),

      frequencia: fd.get("frequencia"),

      observacoes:
          (fd.get("observacoes") || "").trim(),

      alunoId: alunoId

    };

    // Checkbox marcado = true.
    // Checkbox desmarcado = false.
    booleanFields.forEach(name => {
      payload[name] = form.elements[name].checked;
    });

    console.log("Payload da anamnese:", payload);
    console.log("Data da avaliação:", payload.dataAvaliacao);

    if (!payload.dataAvaliacao) {

      showError("Informe a data da avaliação.");

      return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Salvando...";

    try {

      const response = await API.request("/anamnese", {

        method: "POST",

        body: JSON.stringify(payload)

      });

      if (!response.ok) {

        throw new Error(
            await readMessage(
                response,
                "Não foi possível salvar a anamnese."
            )
        );

      }

      // Abre o modal personalizado de sucesso.
      successModal.showModal();

    } catch (error) {

      showError(
          error.message || "Erro ao salvar a anamnese."
      );

      saveButton.disabled = false;
      saveButton.textContent = "Salvar anamnese";

    }

  });

  // Lê mensagens de resposta do backend.
  async function readMessage(response, fallback) {

    const text = await response.text();

    if (!text) {
      return fallback;
    }

    try {

      const json = JSON.parse(text);

      return json.message ||
          json.mensagem ||
          json.error ||
          text;

    } catch {

      return text;

    }

  }

  function showError(message) {

    errorBox.textContent = message;

  }

})();
