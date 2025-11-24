const API_URL = 'http://localhost:8081/api/login';

const form = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const loginErrorMessage = document.getElementById('login-error-message');
const loginBtn = document.getElementById('login-btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Ocultar errores previos
    loginError.classList.add('hidden');
    
    // Deshabilitar botón
    loginBtn.disabled = true;
    loginBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Iniciando...
    `;
    
    const datos = {
        Correo: document.getElementById('email').value.trim(),
        Password: document.getElementById('password').value
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        if (response.ok) {
            // ✅ Login exitoso - Guardar datos del usuario
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            // Mostrar mensaje de éxito
            loginBtn.innerHTML = `
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                ¡Éxito! Redirigiendo...
            `;
            loginBtn.classList.remove('from-blue-600', 'to-purple-600');
            loginBtn.classList.add('from-green-600', 'to-green-700');
            
            // Redirigir después de 1 segundo
            setTimeout(() => {
                window.location.href = 'Productos.html';
            }, 1000);
            
        } else {
            // ❌ Error - Mostrar mensaje
            mostrarError(data.message || 'Error al iniciar sesión');
            restaurarBoton();
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        mostrarError('Error de conexión con el servidor');
        restaurarBoton();
    }
});

function mostrarError(mensaje) {
    loginError.classList.remove('hidden');
    loginErrorMessage.textContent = mensaje;
}

function restaurarBoton() {
    loginBtn.disabled = false;
    loginBtn.innerHTML = `
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
        </svg>
        Iniciar Sesión
    `;
    loginBtn.classList.remove('from-green-600', 'to-green-700');
    loginBtn.classList.add('from-blue-600', 'to-purple-600');
}