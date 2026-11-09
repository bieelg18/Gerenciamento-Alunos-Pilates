
document.addEventListener("DOMContentLoaded", () => {

    // Garante que o recurso exista somente nas páginas autenticadas.
    if (typeof API === "undefined") return;

    const topbar = document.querySelector(".topbar__inner");
    if (!topbar) return;

    // Adiciona o botão automaticamente nas páginas que ainda não possuem.
    if (!document.querySelector('[data-action="change-password"]')) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "password-global-trigger";
        button.dataset.action = "change-password";
        button.textContent = "Alterar senha";

        topbar.appendChild(button);
    }

    // Cria o modal global.
    const modal = document.createElement("dialog");
    modal.id = "global-password-dialog";
    modal.className = "password-dialog";

    modal.innerHTML = `
        <form id="change-password-form" class="password-dialog__content">

            <button class="password-dialog__close"
                    type="button"
                    aria-label="Fechar">×</button>

            <span class="password-dialog__icon">
                <svg viewBox="0 0 24 24" fill="none">
                    <rect x="4.5" y="10" width="15" height="10" rx="2.2"/>
                    <path d="M8 10V7.2a4 4 0 0 1 8 0V10"/>
                </svg>
            </span>

            <span class="password-dialog__eyebrow">
                SEGURANÇA DA CONTA
            </span>

            <h2>Alterar senha</h2>

            <p class="password-dialog__description">
                Atualize sua senha para manter sua conta protegida.
            </p>

            <div class="password-field">
                <label for="senha-atual">Senha atual</label>
                <input
                    id="senha-atual"
                    name="senhaAtual"
                    type="password"
                    autocomplete="current-password"
                    placeholder="Digite sua senha atual"
                    required>
            </div>

            <div class="password-field">
                <label for="nova-senha">Nova senha</label>
                <input
                    id="nova-senha"
                    name="novaSenha"
                    type="password"
                    autocomplete="new-password"
                    placeholder="Digite sua nova senha"
                    required>
            </div>

            <div class="password-field">
                <label for="confirmar-senha">Confirmar nova senha</label>
                <input
                    id="confirmar-senha"
                    name="confirmarSenha"
                    type="password"
                    autocomplete="new-password"
                    placeholder="Digite novamente a nova senha"
                    required>
            </div>

            <div id="password-feedback"
                 class="password-feedback"
                 role="status"
                 aria-live="polite"></div>

            <button class="password-dialog__submit"
                    id="password-submit"
                    type="submit">
                Salvar nova senha
            </button>

        </form>
    `;

    document.body.appendChild(modal);

    const form = document.querySelector("#change-password-form");
    const feedback = document.querySelector("#password-feedback");
    const submitButton = document.querySelector("#password-submit");

    // Abre o modal mesmo que já existam listeners nos JS das páginas.
    document.addEventListener("click", event => {

        const button = event.target.closest(
            '[data-action="change-password"]'
        );

        if (!button) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        const mobileMenu = document.querySelector("#mobile-menu");
        const menuToggle = document.querySelector("#menu-toggle");

        if (mobileMenu) mobileMenu.hidden = true;

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
        }

        feedback.textContent = "";
        feedback.className = "password-feedback";

        form.reset();
        modal.showModal();

    }, true);

    // Fechar modal.
    modal.querySelector(".password-dialog__close")
        .addEventListener("click", () => modal.close());

    modal.addEventListener("click", event => {
        if (event.target === modal) modal.close();
    });

    // Enviar alteração de senha.
    form.addEventListener("submit", async event => {

        event.preventDefault();

        const senhaAtual = form.senhaAtual.value;
        const novaSenha = form.novaSenha.value;
        const confirmarSenha = form.confirmarSenha.value;

        feedback.textContent = "";
        feedback.className = "password-feedback";

        if (novaSenha !== confirmarSenha) {
            feedback.textContent = "As novas senhas não coincidem.";
            feedback.classList.add("password-feedback--error");
            return;
        }

        if (senhaAtual === novaSenha) {
            feedback.textContent = "A nova senha deve ser diferente da atual.";
            feedback.classList.add("password-feedback--error");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Salvando...";

        try {

            const response = await API.request("/professor/senha", {
                method: "PATCH",
                body: JSON.stringify({
                    senhaAtual,
                    novaSenha
                })
            });

            const responseText = await response.text();

            let responseData = null;

            try {
                responseData = responseText
                    ? JSON.parse(responseText)
                    : null;
            } catch {
                responseData = responseText;
            }

            if (!response.ok) {
                const message =
                    typeof responseData === "string"
                        ? responseData
                        : responseData?.message ||
                        responseData?.detail ||
                        responseData?.erro ||
                        "Não foi possível alterar a senha.";

                throw new Error(message);
            }

            feedback.textContent =
                typeof responseData === "string" && responseData
                    ? responseData
                    : "Senha alterada com sucesso!";

            feedback.classList.add("password-feedback--success");

            form.reset();

        } catch (error) {

            if (error.message !== "Sua sessão expirou. Entre novamente.") {
                feedback.textContent = error.message;
                feedback.classList.add("password-feedback--error");
            }

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Salvar nova senha";

        }

    });

});
