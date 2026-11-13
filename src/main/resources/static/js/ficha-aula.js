
document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        window.location.replace("/login.html");
        return;
    }

    // =====================================================
    // CONFIGURAÇÕES INICIAIS
    // =====================================================

    const params = new URLSearchParams(window.location.search);

    const alunoId = Number(params.get("id"));

    const fichaIdParam = params.get("fichaId");
    const modoEdicao = fichaIdParam !== null;
    const fichaId = modoEdicao ? Number(fichaIdParam) : null;

    const form = document.querySelector("#ficha-form");
    const saveButton = document.querySelector("#save-button");
    const errorBox = document.querySelector("#form-error");
    const studentName = document.querySelector("#student-name");

    const painDetails = document.querySelector("#pain-details");
    const locationInput = document.querySelector("#localizacaoDorChegada");

    const successModal = document.querySelector("#success-modal");
    const successBackButton = document.querySelector("#success-back-button");

    const profileUrl =
        `/alunos/detalhes.html?id=${encodeURIComponent(alunoId)}`;

    const historyUrl =
        `/alunos/fichas-aula.html?id=${encodeURIComponent(alunoId)}`;

    const textoBotao = modoEdicao
        ? "Salvar alterações"
        : "Salvar ficha de aula";

    document.querySelector("#profile-link").href = profileUrl;

    document.querySelector("#back-link").href =
        modoEdicao ? historyUrl : profileUrl;

    document.querySelector("#cancel-link").href =
        modoEdicao ? historyUrl : profileUrl;

    document.querySelector("#logout-button").addEventListener("click", () => {
        API.logout();
    });

    // =====================================================
    // VALIDAÇÃO DOS IDENTIFICADORES
    // =====================================================

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
        studentName.textContent = "Aluno não identificado";
        showError("Identificação do aluno inválida.");
        saveButton.disabled = true;
        return;
    }

    if (
        modoEdicao &&
        (!Number.isInteger(fichaId) || fichaId <= 0)
    ) {
        showError("Identificação da ficha inválida.");
        saveButton.disabled = true;
        return;
    }

    // =====================================================
    // CONFIGURAÇÃO DA TELA
    // =====================================================

    saveButton.textContent = textoBotao;

    if (modoEdicao) {
        document.title = "Editar ficha de aula | Movimento+";

        const titulo = document.querySelector(".page-heading h1");

        if (titulo) {
            titulo.innerHTML = "Editar ficha de <em>aula</em>";
        }

        const descricao = document.querySelector(".page-heading p");

        if (descricao) {
            descricao.textContent =
                "Atualize as atividades e avaliações registradas nesta aula.";
        }

        const breadcrumb = document.querySelector(".breadcrumb");

        if (breadcrumb) {
            const ultimoItem = breadcrumb.lastElementChild;

            if (ultimoItem) {
                ultimoItem.textContent = "Editar ficha de aula";
            }
        }
    }

    // Define a data atual somente no modo de criação.
    if (!modoEdicao) {
        const today = new Date();

        document.querySelector("#dataAula").value = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().slice(0, 10);
    }

    // =====================================================
    // MODAL DE SUCESSO E LOGOUT
    // =====================================================

    successBackButton.addEventListener("click", () => {
        window.location.replace(
            modoEdicao ? historyUrl : profileUrl
        );
    });

    // =====================================================
    // CARREGAMENTO INICIAL
    // =====================================================

    carregarAluno();

    if (modoEdicao) {
        carregarFicha();
    }

    async function carregarAluno() {
        try {
            const response = await API.request(`/aluno/${alunoId}`);

            if (!response.ok) {
                throw new Error(
                    "Não foi possível carregar os dados do aluno."
                );
            }

            const aluno = await response.json();

            studentName.textContent =
                aluno.nome || `Aluno #${alunoId}`;

        } catch (error) {
            if (
                error.message !==
                "Sua sessão expirou. Entre novamente."
            ) {
                studentName.textContent = `Aluno #${alunoId}`;
                showError(error.message);
            }
        }
    }

    // =====================================================
    // CARREGAR FICHA PARA EDIÇÃO
    // =====================================================

    async function carregarFicha() {
        saveButton.disabled = true;
        saveButton.textContent = "Carregando ficha...";

        try {
            const response = await API.request(
                `/ficha-aula/aluno/${fichaId}`
            );

            if (!response.ok) {
                throw new Error(await readMessage(response));
            }

            const ficha = await response.json();

            // Confere o vínculo quando o DTO fornece o alunoId.
            // A autorização definitiva é feita no backend.
            if (
                ficha.alunoId != null &&
                Number(ficha.alunoId) !== alunoId
            ) {
                throw new Error(
                    "Esta ficha não pertence ao aluno informado."
                );
            }

            preencherFormulario(ficha);

            saveButton.disabled = false;
            saveButton.textContent = textoBotao;

        } catch (error) {
            if (
                error.message !==
                "Sua sessão expirou. Entre novamente."
            ) {
                showError(error.message);
            }

            saveButton.disabled = true;
            saveButton.textContent =
                "Não foi possível carregar a ficha";
        }
    }

    // =====================================================
    // PREENCHIMENTO AUTOMÁTICO DO FORMULÁRIO
    // =====================================================

    function preencherFormulario(ficha) {
        // Data da aula
        form.elements.dataAula.value = ficha.dataAula || "";

        // Aparelhos utilizados
        marcarOpcoes("aparelhos", ficha.aparelhos);

        // Acessórios utilizados
        marcarOpcoes("acessorios", ficha.acessorios);

        // Atividades realizadas
        const atividades = Array.isArray(ficha.atividades)
            ? ficha.atividades.map(atividade =>
                `${atividade.regiaoCorporal}|${atividade.tipoAtividade}`
            )
            : [];

        marcarOpcoes("atividade", atividades);

        // Power House
        marcarRadio(
            "avaliacaoPowerHouse",
            ficha.avaliacaoPowerHouse
        );

        // Princípios do Pilates
        const principios = [
            "respiracao",
            "concentracao",
            "precisao",
            "fluidez",
            "controle"
        ];

        principios.forEach(campo => {
            form.elements[campo].value = ficha[campo] ?? "";
        });

        // Condição de dor na chegada
        marcarRadio(
            "condicaoDorChegada",
            ficha.condicaoDorChegada
        );

        atualizarCamposDor();

        if (ficha.condicaoDorChegada === "COM_DOR") {
            locationInput.value =
                ficha.localizacaoDorChegada ?? "";

            marcarRadio("escalaDor", ficha.escalaDor);
        }

        // Condição de dor ao finalizar
        marcarRadio(
            "condicaoDorFinal",
            ficha.condicaoDorFinal
        );

        // Observações
        form.elements.observacoes.value =
            ficha.observacoes ?? "";
    }

    function marcarOpcoes(nome, valores) {
        const selecionados = new Set(
            Array.isArray(valores)
                ? valores.map(String)
                : []
        );

        form.querySelectorAll(
            `input[name="${nome}"]`
        ).forEach(input => {
            input.checked = selecionados.has(input.value);
        });
    }

    function marcarRadio(nome, valor) {
        form.querySelectorAll(
            `input[name="${nome}"]`
        ).forEach(input => {
            input.checked =
                input.value === String(valor ?? "");
        });
    }

    // =====================================================
    // CONDIÇÃO DE DOR NA CHEGADA
    // =====================================================

    document.querySelectorAll(
        'input[name="condicaoDorChegada"]'
    ).forEach(input => {
        input.addEventListener(
            "change",
            atualizarCamposDor
        );
    });

    function atualizarCamposDor() {
        const condicao = form.querySelector(
            'input[name="condicaoDorChegada"]:checked'
        )?.value;

        const possuiDor = condicao === "COM_DOR";

        painDetails.hidden = !possuiDor;

        locationInput.required = possuiDor;

        form.querySelectorAll(
            'input[name="escalaDor"]'
        ).forEach(input => {
            input.required = possuiDor;

            if (!possuiDor) {
                input.checked = false;
            }
        });

        if (!possuiDor) {
            locationInput.value = "";
        }
    }

    // =====================================================
    // ENVIO DA FICHA - POST OU PUT
    // =====================================================

    form.addEventListener("submit", async event => {
        event.preventDefault();

        errorBox.textContent = "";

        if (!form.reportValidity()) {
            return;
        }

        // Aparelhos
        const aparelhos = Array.from(
            form.querySelectorAll(
                'input[name="aparelhos"]:checked'
            )
        ).map(input => input.value);

        // Atividades
        const atividades = Array.from(
            form.querySelectorAll(
                'input[name="atividade"]:checked'
            )
        ).map(input => {
            const [regiaoCorporal, tipoAtividade] =
                input.value.split("|");

            return {
                regiaoCorporal,
                tipoAtividade
            };
        });

        // Acessórios
        const acessorios = Array.from(
            form.querySelectorAll(
                'input[name="acessorios"]:checked'
            )
        ).map(input => input.value);

        // Princípios
        const respiracao =
            form.elements.respiracao.value.trim() || null;

        const concentracao =
            form.elements.concentracao.value.trim() || null;

        const precisao =
            form.elements.precisao.value.trim() || null;

        const fluidez =
            form.elements.fluidez.value.trim() || null;

        const controle =
            form.elements.controle.value.trim() || null;

        // Dor na chegada
        const condicaoDorChegada = form.querySelector(
            'input[name="condicaoDorChegada"]:checked'
        )?.value;

        const escalaSelecionada = form.querySelector(
            'input[name="escalaDor"]:checked'
        );

        // Avaliação Power House
        const avaliacaoPowerHouse = form.querySelector(
            'input[name="avaliacaoPowerHouse"]:checked'
        )?.value;

        // Dor ao finalizar
        const condicaoDorFinal = form.querySelector(
            'input[name="condicaoDorFinal"]:checked'
        )?.value;

        // =================================================
        // PAYLOAD
        // =================================================

        const payload = {
            dataAula: form.elements.dataAula.value,

            aparelhos,
            atividades,
            acessorios,

            avaliacaoPowerHouse,

            respiracao,
            concentracao,
            precisao,
            fluidez,
            controle,

            condicaoDorChegada,

            localizacaoDorChegada:
                condicaoDorChegada === "COM_DOR"
                    ? locationInput.value.trim()
                    : null,

            escalaDor:
                condicaoDorChegada === "COM_DOR" &&
                escalaSelecionada
                    ? Number(escalaSelecionada.value)
                    : null,

            condicaoDorFinal,

            observacoes:
                form.elements.observacoes.value.trim(),

            alunoId
        };

        // =================================================
        // VALIDAÇÕES
        // =================================================

        if (aparelhos.length === 0) {
            showError(
                "Selecione pelo menos um aparelho utilizado na aula."
            );
            return;
        }

        if (atividades.length === 0) {
            showError(
                "Selecione pelo menos uma atividade realizada."
            );
            return;
        }

        if (!avaliacaoPowerHouse) {
            showError(
                "Informe a avaliação do Power House."
            );
            return;
        }

        if (!condicaoDorChegada) {
            showError(
                "Informe a condição de dor na chegada."
            );
            return;
        }

        if (!condicaoDorFinal) {
            showError(
                "Informe a condição de dor ao finalizar."
            );
            return;
        }

        if (
            condicaoDorChegada === "COM_DOR" &&
            (
                !payload.localizacaoDorChegada ||
                payload.escalaDor === null
            )
        ) {
            showError(
                "Informe a localização e a escala da dor."
            );
            return;
        }

        // =================================================
        // SALVAR
        // =================================================

        saveButton.disabled = true;

        saveButton.textContent = modoEdicao
            ? "Salvando alterações..."
            : "Salvando ficha...";

        try {
            const endpoint = modoEdicao
                ? `/ficha-aula/${fichaId}`
                : "/ficha-aula";

            const metodo = modoEdicao
                ? "PUT"
                : "POST";

            const response = await API.request(endpoint, {
                method: metodo,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(await readMessage(response));
            }

            if (modoEdicao) {
                window.location.replace(historyUrl);
                return;
            }

            successModal.showModal();

        } catch (error) {
            if (
                error.message !==
                "Sua sessão expirou. Entre novamente."
            ) {
                showError(error.message);
            }

            saveButton.disabled = false;
            saveButton.textContent = textoBotao;
        }
    });

    // =====================================================
    // FUNÇÕES AUXILIARES
    // =====================================================

    async function readMessage(response) {
        const responseText = await response.text();

        if (!responseText) {
            return modoEdicao
                ? "Não foi possível atualizar a ficha de aula."
                : "Não foi possível salvar a ficha de aula.";
        }

        try {
            const data = JSON.parse(responseText);

            return (
                data.message ||
                data.mensagem ||
                data.erro ||
                data.error ||
                responseText
            );

        } catch {
            return responseText;
        }
    }

    function showError(message) {
        errorBox.textContent = message;

        errorBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
});
