// script de login - Techstore pro

document.addEventListener('DOMContentLoaded', function(){
    console.log('✅ Página cargada correctamente - sistema listo');

    const API_URL = "http://localhost:8081/api/login";

    // Enviar los datos del formulario
    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        const errormsg = document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        // Recoger los campos del formulario con nombres que espera el backend
        const datos = {
            Correo: document.getElementById('email').value.trim(),
            Password: document.getElementById('password').value
        };

        console.log("Datos a enviar:", datos); // <--- depuración en consola del navegador

        // Validar que los campos no estén vacíos
        if (!datos.Correo || !datos.Password) {
            errormsg.textContent = 'Por favor complete los datos';
            errorDiv.classList.remove('hidden');
            return;
        }

        // Cambiar el botón mientras procesa
        btn.disabled = true;
        btn.textContent = 'Iniciando sesión...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok) {
                console.log('✅ Inicio de sesión exitoso');

                // Guardar información (opcional, si tu backend devuelve usuario)
                localStorage.setItem("sesionActiva", "true");

                // Mostrar mensaje de éxito
                errorDiv.className = 'bg-green-50 border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errormsg.textContent = 'Inicio de sesión correcto, redirigiendo...';
                errorDiv.classList.remove('hidden');

                // Redirigir a productos
                setTimeout(() => window.location.href = 'productos.html', 2000);

            } else {
                errormsg.textContent = resultado.message || 'Credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Iniciar Sesión';
            }

        } catch (error) {
            console.error('❌ Error de conexión con el servidor', error);
            errormsg.textContent = 'Error de conexión con el servidor';
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Iniciar Sesión';
        }

    });

});
