document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
        window.location.replace("/index.html");
        return;
    }

    const listElement = document.querySelector("#students-list");
    const statusElement = document.querySelector("#list-status");
    const countElement = document.querySelector("#student-count");
    const searchInput = document.querySelector("#student-search");
    const clearSearchButton = document.querySelector("#clear-search");
    const menuToggle = document.querySelector("#menu-toggle");
    const mobileMenu = document.querySelector("#mobile-menu");
    const changePasswordDialog = document.querySelector("#change-password-dialog");

    let searchTimer = null;
    let requestSequence = 0;

    function closeMobileMenu() {
        mobileMenu.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
        mobileMenu.hidden = isOpen;
    });

    document.querySelectorAll('[data-action="logout"]').forEach(button => {
        button.addEventListener("click", () => API.logout());
    });

    document.querySelectorAll('[data-action="change-password"]').forEach(button => {
        button.addEventListener("click", () => {
            closeMobileMenu();
            changePasswordDialog.showModal();
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMobileMenu();
    });

    function showStatus(type, title, description, withRetry = false) {
        listElement.replaceChildren();
        statusElement.hidden = false;
        statusElement.className = "list-status";

        if (type === "loading") {
            const spinner = document.createElement("span");
            spinner.className = "loading-spinner";
            spinner.setAttribute("aria-hidden", "true");
            const message = document.createElement("span");
            message.textContent = title;
            statusElement.replaceChildren(spinner, message);
            return;
        }

        const icon = document.createElement("span");
        icon.className = "status-icon";
        icon.innerHTML = type === "empty"
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 4.5 4.5"></path></svg>'
            : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v4m0 4h.01"></path><circle cx="12" cy="12" r="9"></circle></svg>';

        const heading = document.createElement("strong");
        heading.className = "status-title";
        heading.textContent = title;

        const text = document.createElement("span");
        text.className = "status-description";
        text.textContent = description;

        statusElement.replaceChildren(icon, heading, text);

        if (withRetry) {
            const retry = document.createElement("button");
            retry.type = "button";
            retry.className = "retry-button";
            retry.textContent = "Tentar novamente";
            retry.addEventListener("click", () => loadStudents(searchInput.value.trim()));
            statusElement.append(retry);
        }
    }

    function getInitials(name) {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return "?";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function renderStudents(students, searchTerm) {
        listElement.replaceChildren();
        statusElement.hidden = true;

        countElement.textContent = students.length === 1
            ? "1 aluno"
            : `${students.length} alunos`;

        if (students.length === 0) {
            if (searchTerm) {
                showStatus("empty", "Nenhum aluno encontrado", "Não encontramos alunos com esse nome. Tente outra pesquisa.");
            } else {
                showStatus("empty", "Nenhum aluno cadastrado", "Quando um novo aluno for cadastrado, ele aparecerá aqui.");
            }
            return;
        }

        const fragment = document.createDocumentFragment();

        students.forEach(student => {
            const link = document.createElement("a");
            link.className = "student-row";
            link.href = `/alunos/detalhes.html?id=${encodeURIComponent(student.id)}`;
            link.setAttribute("aria-label", `Consultar ${student.nome}`);

            const avatar = document.createElement("span");
            avatar.className = "student-avatar";
            avatar.textContent = getInitials(student.nome || "");

            const info = document.createElement("span");
            info.className = "student-info";

            const name = document.createElement("span");
            name.className = "student-name";
            name.textContent = student.nome || "Aluno sem nome";

            const subtitle = document.createElement("span");
            subtitle.className = "student-subtitle";
            subtitle.textContent = "Consultar informações do aluno";

            info.append(name, subtitle);

            const arrow = document.createElement("span");
            arrow.className = "student-arrow";
            arrow.setAttribute("aria-hidden", "true");
            arrow.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';

            link.append(avatar, info, arrow);
            fragment.append(link);
        });

        listElement.append(fragment);
    }

    async function loadStudents(searchTerm = "") {
        const currentRequest = ++requestSequence;
        const normalizedTerm = searchTerm.trim();

        clearSearchButton.hidden = normalizedTerm.length === 0;
        showStatus("loading", normalizedTerm ? "Pesquisando alunos..." : "Carregando alunos...");

        const endpoint = normalizedTerm
            ? `/aluno/buscar?nome=${encodeURIComponent(normalizedTerm)}`
            : "/aluno/all";

        try {
            const response = await API.request(endpoint, { method: "GET" });

            if (!response.ok) {
                let message = "Não foi possível carregar os alunos.";
                try {
                    const body = await response.json();
                    message = body.message || body.mensagem || body.error || message;
                } catch { /* Mantém mensagem padrão quando a resposta não for JSON. */ }
                throw new Error(message);
            }

            const students = await response.json();
            if (currentRequest !== requestSequence) return;

            if (!Array.isArray(students)) {
                throw new Error("O servidor retornou um formato inesperado.");
            }

            renderStudents(students, normalizedTerm);
        } catch (error) {
            if (currentRequest !== requestSequence) return;
            if (error.message === "Sua sessão expirou. Entre novamente.") return;

            countElement.textContent = "—";
            showStatus("error", "Não foi possível carregar os alunos", error.message || "Verifique sua conexão e tente novamente.", true);
        }
    }

    searchInput.addEventListener("input", () => {
        window.clearTimeout(searchTimer);
        const term = searchInput.value.trim();
        clearSearchButton.hidden = term.length === 0;

        searchTimer = window.setTimeout(() => loadStudents(term), 300);
    });

    clearSearchButton.addEventListener("click", () => {
        searchInput.value = "";
        clearSearchButton.hidden = true;
        window.clearTimeout(searchTimer);
        loadStudents("");
        searchInput.focus();
    });

    loadStudents();
});
