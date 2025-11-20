document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        Nombre: document.getElementById("nombre").value,
        Apellido: document.getElementById("apellido").value,
        Telefono: document.getElementById("telefono").value,
        Correo: document.getElementById("correo").value,
        Password: document.getElementById("password").value,
    };

    const res = await fetch("http://localhost:8081/api/User/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const info = await res.json();
    console.log(info);
});
