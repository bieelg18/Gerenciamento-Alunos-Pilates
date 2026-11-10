/*
 * Cliente HTTP compartilhado da aplicação.
 * Todas as chamadas protegidas enviam automaticamente o JWT.
 */
const API = {
    async request(url, options = {}) {
        const token = sessionStorage.getItem("accessToken");

        const headers = new Headers(options.headers || {});
        headers.set("Accept", "application/json");

        if (options.body && !(options.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            sessionStorage.removeItem("accessToken");
            window.location.replace("/login.html");
            throw new Error("Sua sessão expirou. Entre novamente.");
        }

        return response;
    },

    logout() {
        sessionStorage.removeItem("accessToken");
        window.location.replace("/login.html");
    }
};
