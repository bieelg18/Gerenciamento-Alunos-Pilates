document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("accessToken");

    // Protege a página: sem token, volta para o login.
    if (!token) {
        window.location.replace("/login.html");
        return;
    }

    const menuToggle = document.querySelector("#menu-toggle");
    const mobileMenu = document.querySelector("#mobile-menu");
    const changePasswordDialog = document.querySelector("#change-password-dialog");

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
});
