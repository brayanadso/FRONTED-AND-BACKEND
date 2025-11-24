document.addEventListener("DOMContentLoaded", () => {

    const userIcon = document.getElementById("user-icon");
    const userInitial = document.getElementById("user-initial");
    const loginBtn = document.getElementById("login-btn");
    const userMenu = document.getElementById("user-menu");

    // Leer usuario del localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario) {

        // --- Iniciales (2 letras) ---
        const nombre = usuario.Nombre || "";
        const apellido = usuario.Apellido || "";
        const iniciales =
            `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

        userInitial.textContent = iniciales;

        // Mostrar icono de usuario
        userIcon.classList.remove("hidden");

        // Ocultar login
        loginBtn.classList.add("hidden");

        // Abrir y cerrar menú
        userIcon.addEventListener("click", (e) => {
            e.stopPropagation(); 
            userMenu.classList.toggle("hidden");
        });

        // Cerrar menú cuando se hace click afuera
        document.addEventListener("click", (e) => {
            if (!userIcon.contains(e.target)) {
                userMenu.classList.add("hidden");
            }
        });
    } else {
        // Si no hay usuario → ocultar icono
        userIcon.classList.add("hidden");
        loginBtn.classList.remove("hidden");
    }
});


// --- CERRAR SESIÓN ---
function cerrarSesion() {

    localStorage.removeItem("usuario");

    // Animación (solo si tienes el toast)
    const toast = document.getElementById("logout-toast");
    if (toast) {
        toast.classList.remove("hidden");
        toast.classList.add("opacity-100");

        setTimeout(() => toast.classList.remove("opacity-100"), 1200);
    }

    // Ir al login o productos
    setTimeout(() => window.location.href = "login.html", 1500);
}
