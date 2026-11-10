
document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
        window.location.replace("/login.html");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const alunoId = Number(params.get("id"));

    const form = document.querySelector("#ficha-form");
    const saveButton = document.querySelector("#save-button");
    const errorBox = document.querySelector("#form-error");
    const studentName = document.querySelector("#student-name");

    const painDetails = document.querySelector("#pain-details");
    const locationInput = document.querySelector("#localizacaoDorChegada");

    const successModal = document.querySelector("#success-modal");
    const successBackButton = document.querySelector("#success-back-button");

    const profileUrl = `/alunos/detalhes.html?id=${encodeURIComponent(alunoId)}`;

    document.querySelector("#profile-link").href = profileUrl;
    document.querySelector("#back-link").href = profileUrl;
    document.querySelector("#cancel-link").href = profileUrl;

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
        studentName.textContent = "Aluno não identificado";
        showError("Identificação do aluno inválida.");
        saveButton.disabled = true;
        return;
    }

    // Define a data atual considerando o fuso horário local.
    const today = new Date();

    document.querySelector("#dataAula").value = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    successBackButton.addEventListener("click", () => {
        window.location.replace(profileUrl);
    });

    document.querySelector("#logout-button").addEventListener("click", () => {
        API.logout();
    });

    carregarAluno();

    async function carregarAluno() {
        try {
            const response = await API.request(`/aluno/${alunoId}`);

            if (!response.ok) {
                throw new Error("Não foi possível carregar os dados do aluno.");
            }

            const aluno = await response.json();

            studentName.textContent = aluno.nome || `Aluno #${alunoId}`;

        } catch (error) {
            if (error.message !== "Sua sessão expirou. Entre novamente.") {
                studentName.textContent = `Aluno #${alunoId}`;
                showError(error.message);
            }
        }
    }

    // =====================================================
    // CONDIÇÃO DE DOR NA CHEGADA
    // =====================================================

    document.querySelectorAll('input[name="condicaoDorChegada"]').forEach(input => {
        input.addEventListener("change", atualizarCamposDor);
    });

    function atualizarCamposDor() {
        const condicao = form.querySelector(
            'input[name="condicaoDorChegada"]:checked'
        )?.value;

        const possuiDor = condicao === "COM_DOR";

        painDetails.hidden = !possuiDor;

        locationInput.required = possuiDor;

        form.querySelectorAll('input[name="escalaDor"]').forEach(input => {
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
    // ENVIO DA FICHA
    // =====================================================

    form.addEventListener("submit", async event => {
        event.preventDefault();

        errorBox.textContent = "";

        if (!form.reportValidity()) {
            return;
        }

        const aparelhos = Array.from(
            form.querySelectorAll('input[name="aparelhos"]:checked')
        ).map(input => input.value);

        const atividades = Array.from(
            form.querySelectorAll('input[name="atividade"]:checked')
        ).map(input => {
            const [regiaoCorporal, tipoAtividade] = input.value.split("|");

            return {
                regiaoCorporal,
                tipoAtividade
            };
        });

        const condicaoDorChegada = form.querySelector(
            'input[name="condicaoDorChegada"]:checked'
        ).value;

        const escalaSelecionada = form.querySelector(
            'input[name="escalaDor"]:checked'
        );

        const payload = {
            dataAula: form.elements.dataAula.value,

            aparelhos,

            atividades,

            avaliacaoPowerHouse: form.querySelector(
                'input[name="avaliacaoPowerHouse"]:checked'
            ).value,

            condicaoDorChegada,

            localizacaoDorChegada:
                condicaoDorChegada === "COM_DOR"
                    ? locationInput.value.trim()
                    : null,

            escalaDor:
                condicaoDorChegada === "COM_DOR"
                    ? Number(escalaSelecionada.value)
                    : null,

            condicaoDorFinal: form.querySelector(
                'input[name="condicaoDorFinal"]:checked'
            ).value,

            observacoes: form.elements.observacoes.value.trim(),

            alunoId
        };

        if (aparelhos.length === 0) {
            showError("Selecione pelo menos um aparelho utilizado na aula.");
            return;
        }

        if (atividades.length === 0) {
            showError("Selecione pelo menos uma atividade realizada.");
            return;
        }

        if (
            condicaoDorChegada === "COM_DOR" &&
            (!payload.localizacaoDorChegada || !payload.escalaDor)
        ) {
            showError("Informe a localização e a escala da dor.");
            return;
        }

        console.log("Payload da ficha de aula:", payload);

        saveButton.disabled = true;
        saveButton.textContent = "Salvando ficha...";

        try {
            const response = await API.request("/ficha-aula", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(await readMessage(response));
            }

            successModal.showModal();

        } catch (error) {
            if (error.message !== "Sua sessão expirou. Entre novamente.") {
                showError(error.message);
            }

            saveButton.disabled = false;
            saveButton.textContent = "Salvar ficha de aula";
        }
    });

    // =====================================================
    // AUXILIARES
    // =====================================================

    async function readMessage(response) {
        const responseText = await response.text();

        if (!responseText) {
            return "Não foi possível salvar a ficha de aula.";
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
