/*
 * Login — Gerenciamento Alunos Pilates
 *
 * Contrato esperado do backend:
 * POST /auth/login
 * Body: { "email": "...", "senha": "..." }
 * Response: { "token": "JWT..." } ou { "accessToken": "JWT..." }
 *
 * Se seu DTO/retorno usar outros nomes, ajuste LOGIN_CONFIG abaixo.
 */
const LOGIN_CONFIG = {
    endpoint: "/auth/login",
    emailField: "email",
    passwordField: "senha",
    tokenFields: ["token"]
};

const form = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#senha");
const submitButton = document.querySelector("#submit-button");
const messageBox = document.querySelector("#form-message");
const togglePasswordButton = document.querySelector("#toggle-password");

function showMessage(message, type = "error") {
    messageBox.textContent = message;
    messageBox.className = `form-message is-visible is-${type}`;
}

function clearMessage() {
    messageBox.textContent = "";
    messageBox.className = "form-message";
}

function setLoading(loading) {
    submitButton.disabled = loading;
    submitButton.classList.toggle("is-loading", loading);
    submitButton.querySelector(".submit-button__text").textContent =
        loading ? "Entrando..." : "Entrar";
}

function validateForm() {
    let valid = true;

    document.querySelectorAll(".field").forEach(field => field.classList.remove("has-error"));
    document.querySelectorAll(".field__error").forEach(error => error.textContent = "");

    if (!emailInput.value.trim()) {
        document.querySelector("#email-error").textContent = "Informe seu e-mail.";
        emailInput.closest(".field").classList.add("has-error");
        valid = false;
    } else if (!emailInput.validity.valid) {
        document.querySelector("#email-error").textContent = "Informe um e-mail válido.";
        emailInput.closest(".field").classList.add("has-error");
        valid = false;
    }

    if (!passwordInput.value) {
        document.querySelector("#senha-error").textContent = "Informe sua senha.";
        passwordInput.closest(".field").classList.add("has-error");
        valid = false;
    }

    return valid;
}

function extractToken(responseBody) {
    if (typeof responseBody === "string") return responseBody;
    for (const field of LOGIN_CONFIG.tokenFields) {
        if (typeof responseBody?.[field] === "string" && responseBody[field].trim()) {
            return responseBody[field];
        }
    }
    return null;
}

async function readResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return response.json();
    }
    return response.text();
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    clearMessage();

    if (!validateForm()) return;

    const payload = {
        [LOGIN_CONFIG.emailField]: emailInput.value.trim(),
        [LOGIN_CONFIG.passwordField]: passwordInput.value
    };

    setLoading(true);

    try {
        const response = await fetch(LOGIN_CONFIG.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const body = await readResponse(response);

        if (!response.ok) {
            const backendMessage = typeof body === "object" && body !== null
                ? body.message || body.mensagem || body.error
                : null;

            if (response.status === 401 || response.status === 403) {
                throw new Error("E-mail ou senha inválidos. Confira seus dados e tente novamente.");
            }
            throw new Error(backendMessage || "Não foi possível realizar o login. Tente novamente.");
        }

        const token = extractToken(body);
        if (!token) {
            throw new Error("Login realizado, mas o token não foi encontrado na resposta da API. Verifique o formato retornado pelo backend.");
        }

        // Mantém o JWT apenas durante a sessão atual do navegador.
        sessionStorage.setItem("accessToken", token);

        showMessage("Login realizado com sucesso!", "success");

        // Ajustaremos o destino quando a primeira página autenticada estiver pronta.
        // Redireciona para a página principal após autenticar.
        window.location.href = "/dashboard.html";
    } catch (error) {
        showMessage(error.message || "Não foi possível conectar ao servidor.");
    } finally {
        setLoading(false);
    }
});

togglePasswordButton.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePasswordButton.setAttribute("aria-pressed", String(isPassword));
    togglePasswordButton.setAttribute("aria-label", isPassword ? "Ocultar senha" : "Mostrar senha");
});

[emailInput, passwordInput].forEach(input => {
    input.addEventListener("input", () => {
        input.closest(".field").classList.remove("has-error");
        const error = input.closest(".field").querySelector(".field__error");
        if (error) error.textContent = "";
        clearMessage();
    });
});
