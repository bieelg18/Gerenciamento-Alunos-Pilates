
document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        window.location.replace("/login.html");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const alunoId = Number(params.get("id"));

    const studentName = document.querySelector("#student-name");
    const studentAvatar = document.querySelector("#student-avatar");
    const lessonCount = document.querySelector("#lesson-count");
    const historyList = document.querySelector("#history-list");

    const modal = document.querySelector("#lesson-modal");
    const modalDate = document.querySelector("#modal-date");
    const modalDetails = document.querySelector("#modal-details");

    const profileUrl = `/alunos/detalhes.html?id=${encodeURIComponent(alunoId)}`;

    document.querySelector("#profile-link").href = profileUrl;
    document.querySelector("#back-link").href = profileUrl;

    document.querySelector("#logout-button").addEventListener("click", () => {
        API.logout();
    });

    document.querySelector("#close-modal").addEventListener("click", fecharModal);
    document.querySelector("#close-modal-bottom").addEventListener("click", fecharModal);

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
        exibirErro("Identificação do aluno inválida.");
        return;
    }

    carregarPagina();

    async function carregarPagina() {
        try {
            const [alunoResponse, fichasResponse] = await Promise.all([
                API.request(`/aluno/${alunoId}`),
                API.request(`/ficha-aula/aluno/${alunoId}/all`)
            ]);

            if (!alunoResponse.ok) {
                throw new Error("Não foi possível carregar os dados do aluno.");
            }

            if (!fichasResponse.ok) {
                throw new Error(await lerErro(fichasResponse));
            }

            const aluno = await alunoResponse.json();
            const fichas = await fichasResponse.json();

            exibirAluno(aluno);
            exibirFichas(Array.isArray(fichas) ? fichas : []);

        } catch (error) {
            if (error.message !== "Sua sessão expirou. Entre novamente.") {
                exibirErro(error.message);
            }
        }
    }

    function exibirAluno(aluno) {
        studentName.textContent = aluno.nome || `Aluno #${alunoId}`;
        studentAvatar.textContent = iniciais(aluno.nome || "");
        document.title = `Histórico de ${aluno.nome || "aluno"} | Movimento+`;
    }

    function iniciais(nome) {
        const palavras = nome.trim().split(/\s+/).filter(Boolean);

        if (palavras.length === 0) return "--";

        if (palavras.length === 1) {
            return palavras[0].slice(0, 2).toUpperCase();
        }

        return (palavras[0][0] + palavras.at(-1)[0]).toUpperCase();
    }

    function exibirFichas(fichas) {
        lessonCount.textContent = fichas.length;

        if (fichas.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <strong>Nenhuma aula registrada</strong>
                    Este aluno ainda não possui fichas de aula cadastradas.
                </div>
            `;
            return;
        }

        // O backend já ordena pela data decrescente.
        historyList.innerHTML = fichas.map((ficha, index) => criarCard(ficha, index)).join("");

        historyList.querySelectorAll("[data-lesson-index]").forEach(button => {
            button.addEventListener("click", () => {
                const ficha = fichas[Number(button.dataset.lessonIndex)];

                if (ficha) {
                    abrirDetalhes(ficha);
                }
            });
        });
    }

    function criarCard(ficha, index) {
        const data = formatarData(ficha.dataAula);
        const aparelhos = Array.isArray(ficha.aparelhos) ? ficha.aparelhos : [];

        const semDor = ficha.condicaoDorChegada === "SEM_DOR";

        const aparelhosHtml = aparelhos.length
            ? aparelhos.map(aparelho =>
                `<span class="lesson-tag">${escapar(formatarEnum(aparelho))}</span>`
            ).join("")
            : `<span class="lesson-tag">Não informado</span>`;

        return `
            <article class="lesson-card">
                <div class="lesson-card__top">
                    <div class="lesson-date">
                        <strong>${escapar(data)}</strong>
                        <span>Ficha de aula #${escapar(ficha.id ?? index + 1)}</span>
                    </div>

                    <span class="pain-status ${semDor ? "pain-status--no" : "pain-status--yes"}">
                        ${semDor ? "Sem dor na chegada" : "Com dor na chegada"}
                    </span>
                </div>

                <div class="lesson-meta">
                    <span>Preenchido por: <strong>${escapar(ficha.nomeProfessor || "Não informado")}</strong></span>
                    <span>Turno: <strong>${escapar(formatarEnum(ficha.turno) || "Não informado")}</strong></span>
                </div>

                <div class="lesson-tags">
                    ${aparelhosHtml}
                </div>

                <div class="lesson-card__bottom">
                    <span class="powerhouse">
                        Power House:
                        <strong>${escapar(formatarEnum(ficha.avaliacaoPowerHouse) || "Não informado")}</strong>
                    </span>

                    <button class="view-lesson" type="button" data-lesson-index="${index}">
                        Ver ficha completa →
                    </button>
                </div>
            </article>
        `;
    }

    function abrirDetalhes(ficha) {
        modalDate.textContent = `Aula realizada em ${formatarData(ficha.dataAula)}`;

        const atividades = Array.isArray(ficha.atividades) ? ficha.atividades : [];
        const aparelhos = Array.isArray(ficha.aparelhos) ? ficha.aparelhos : [];

        modalDetails.innerHTML = `
            ${criarSecao("Identificação", `
                <div class="detail-grid">
                    ${criarCampo("Preenchido por", ficha.nomeProfessor)}
                    ${criarCampo("Turno", formatarEnum(ficha.turno))}
                    ${criarCampo("Data da aula", formatarData(ficha.dataAula))}
                    ${criarCampo("Power House", formatarEnum(ficha.avaliacaoPowerHouse))}
                </div>
            `)}

            ${criarSecao("Aparelhos utilizados", criarTags(aparelhos))}

            ${criarSecao("Atividades realizadas", criarAtividades(atividades))}

            ${criarSecao("Condição de dor", `
                <div class="detail-grid">
                    ${criarCampo("Na chegada", formatarEnum(ficha.condicaoDorChegada))}
                    ${criarCampo("Localização na chegada", ficha.localizacaoDorChegada)}
                    ${criarCampo("Escala de dor", ficha.escalaDor ? `${ficha.escalaDor}/10` : "Não se aplica")}
                    ${criarCampo("Ao finalizar", formatarEnum(ficha.condicaoDorFinal))}
                </div>
            `)}

            ${criarSecao("Observações", `
                <p class="detail-observations">${escapar(ficha.observacoes || "Nenhuma observação registrada.")}</p>
            `)}
        `;

        modal.showModal();
    }

    function criarSecao(titulo, conteudo) {
        return `
            <section class="detail-section">
                <h3>${titulo}</h3>
                ${conteudo}
            </section>
        `;
    }

    function criarCampo(rotulo, valor) {
        return `
            <div class="detail-field">
                <span>${escapar(rotulo)}</span>
                <strong>${escapar(valor || "Não informado")}</strong>
            </div>
        `;
    }

    function criarTags(valores) {
        if (!valores.length) {
            return `<span class="detail-field"><strong>Não informado</strong></span>`;
        }

        return `
            <div class="detail-tags">
                ${valores.map(valor => `
                    <span class="detail-tag">${escapar(formatarEnum(valor))}</span>
                `).join("")}
            </div>
        `;
    }

    function criarAtividades(atividades) {
        if (!atividades.length) {
            return `<p class="detail-observations">Nenhuma atividade registrada.</p>`;
        }

        const grupos = {};

        atividades.forEach(atividade => {
            const regiao = atividade.regiaoCorporal || "OUTRAS";
            const tipo = atividade.tipoAtividade || "Não informado";

            if (!grupos[regiao]) {
                grupos[regiao] = [];
            }

            grupos[regiao].push(tipo);
        });

        return Object.entries(grupos).map(([regiao, tipos]) => `
            <div class="activity-detail-group">
                <strong>${escapar(formatarEnum(regiao))}</strong>
                <div class="detail-tags">
                    ${tipos.map(tipo => `
                        <span class="detail-tag">${escapar(formatarEnum(tipo))}</span>
                    `).join("")}
                </div>
            </div>
        `).join("");
    }

    function formatarEnum(valor) {
        if (!valor) return "";

        const traducoes = {
            MANHA: "Manhã",
            TARDE: "Tarde",
            OTIMO: "Ótimo",
            BOM: "Bom",
            RUIM: "Ruim",
            SEM_DOR: "Sem dor",
            COM_DOR: "Com dor",
            TORNOZELO_PE: "Tornozelo/Pé",
            PUNHO_MAO: "Punho/Mão",
            CINTURA_ESCAPULAR: "Cintura escapular",
            CONTROLE_MOTOR: "Controle motor"
        };

        if (traducoes[valor]) return traducoes[valor];

        return String(valor)
            .toLowerCase()
            .replaceAll("_", " ")
            .replace(/\b\w/g, letra => letra.toUpperCase());
    }

    function formatarData(valor) {
        if (!valor) return "Data não informada";

        const partes = valor.split("-");

        if (partes.length !== 3) return valor;

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    function escapar(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caractere]);
    }

    function fecharModal() {
        if (modal.open) {
            modal.close();
        }
    }

    async function lerErro(response) {
        const texto = await response.text();

        if (!texto) return "Não foi possível carregar as fichas de aula.";

        try {
            const dados = JSON.parse(texto);
            return dados.message || dados.mensagem || dados.erro || dados.error || texto;
        } catch {
            return texto;
        }
    }

    function exibirErro(mensagem) {
        historyList.innerHTML = `
            <div class="error-state">
                <strong>Não foi possível carregar o histórico</strong>
                ${escapar(mensagem)}
            </div>
        `;
    }
});
