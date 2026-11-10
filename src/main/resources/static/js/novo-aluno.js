document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("accessToken");

    // A página de cadastro só pode ser acessada após o login.
    if (!token) {
        window.location.replace("/login.html");
        return;
    }

    const form = document.querySelector("#student-form");
    const submitButton = document.querySelector("#submit-button");
    const feedback = document.querySelector("#form-feedback");
    const phoneInput = document.querySelector("#telefone");
    const successDialog = document.querySelector("#success-dialog");
    const successConfirm = document.querySelector("#success-confirm");
    const birthDateInput = document.querySelector("#dataNascimento");

    // Impede selecionar uma data futura.
    birthDateInput.max = new Date().toISOString().split("T")[0];

    function setLoading(loading) {
        submitButton.disabled = loading;
        submitButton.classList.toggle("is-loading", loading);
        submitButton.querySelector(".submit-button__text").textContent =
            loading ? "Cadastrando..." : "Cadastrar aluno";
    }

    function showFeedback(message) {
        feedback.textContent = message;
        feedback.classList.add("is-visible");
    }

    function clearFeedback() {
        feedback.textContent = "";
        feedback.classList.remove("is-visible");
    }

    function clearFieldErrors() {
        document.querySelectorAll(".field").forEach(field => field.classList.remove("has-error"));
        document.querySelectorAll(".field-error").forEach(error => error.textContent = "");
    }

    function setFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) field.closest(".field").classList.add("has-error");
        const error = document.querySelector(`#${fieldName}-error`);
        if (error) error.textContent = message;
    }

    function validateForm() {
        clearFieldErrors();
        clearFeedback();

        let valid = true;
        const nome = document.querySelector("#nome").value.trim();
        const dataNascimento = birthDateInput.value;
        const sexo = form.querySelector('input[name="sexo"]:checked');
        const telefoneDigits = phoneInput.value.replace(/\D/g, "");

        if (!nome) {
            setFieldError("nome", "Informe o nome do aluno.");
            valid = false;
        }

        if (!dataNascimento) {
            setFieldError("dataNascimento", "Informe a data de nascimento.");
            valid = false;
        } else if (dataNascimento > new Date().toISOString().split("T")[0]) {
            setFieldError("dataNascimento", "A data de nascimento não pode ser futura.");
            valid = false;
        }

        if (!sexo) {
            setFieldError("sexo", "Selecione o sexo.");
            valid = false;
        }

        if (!telefoneDigits) {
            setFieldError("telefone", "Informe o telefone.");
            valid = false;
        } else if (telefoneDigits.length < 10 || telefoneDigits.length > 11) {
            setFieldError("telefone", "Informe um telefone com DDD válido.");
            valid = false;
        }

        return valid;
    }

    function formatPhone(value) {
        const digits = value.replace(/\D/g, "").slice(0, 11);

        if (digits.length <= 2) return digits.length ? `(${digits}` : "";
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length <= 10) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        }
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    phoneInput.addEventListener("input", () => {
        phoneInput.value = formatPhone(phoneInput.value);
        phoneInput.closest(".field").classList.remove("has-error");
        document.querySelector("#telefone-error").textContent = "";
    });

    form.addEventListener("input", event => {
        const field = event.target.closest(".field");
        if (field) {
            field.classList.remove("has-error");
            const error = field.querySelector(".field-error");
            if (error) error.textContent = "";
        }
        clearFeedback();
    });

    form.addEventListener("change", event => {
        if (event.target.name === "sexo") {
            document.querySelector(".field--sex").classList.remove("has-error");
            document.querySelector("#sexo-error").textContent = "";
        }
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();

        if (!validateForm()) return;

        const payload = {
            nome: document.querySelector("#nome").value.trim(),
            dataNascimento: birthDateInput.value,
            sexo: form.querySelector('input[name="sexo"]:checked').value,
            telefone: phoneInput.value.trim(),
            profissao: document.querySelector("#profissao").value.trim(),
            patologia: document.querySelector("#patologia").value.trim()
        };

        setLoading(true);

        try {
            const response = await API.request("/aluno", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            const responseText = await response.text();

            if (!response.ok) {
                let message = "Não foi possível cadastrar o aluno. Tente novamente.";
                if (responseText) {
                    try {
                        const body = JSON.parse(responseText);
                        message = body.message || body.mensagem || body.error || message;
                    } catch {
                        message = responseText;
                    }
                }
                throw new Error(message);
            }

            successDialog.showModal();
        } catch (error) {
            if (error.message !== "Sua sessão expirou. Entre novamente.") {
                showFeedback(error.message || "Erro ao conectar com o servidor.");
            }
        } finally {
            setLoading(false);
        }
    });

    successConfirm.addEventListener("click", () => {
        window.location.href = "/dashboard.html";
    });

    successDialog.addEventListener("cancel", event => {
        // Mantém o fluxo explícito: fechar o modal também retorna ao dashboard.
        event.preventDefault();
        window.location.href = "/dashboard.html";
    });
});
