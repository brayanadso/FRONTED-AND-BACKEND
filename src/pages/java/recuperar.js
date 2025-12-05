// Obtener referencias a los elementos del DOM
const form = document.getElementById('formRecuperacion');
const correoInput = document.getElementById('correoElectronico');
const mensajeElement = document.getElementById('mensaje');

// URL base de tu API. Ajusta si tu ruta base no es '/api/recuperar'
const API_URL = '/api/recuperar'; 

// Función para manejar el envío del formulario
const handleEnviarCodigo = async (event) => {
    // Evita que el formulario se envíe de la manera tradicional (recarga de página)
    event.preventDefault(); 

    const Correo = correoInput.value.trim();
    
    if (!Correo) {
        mensajeElement.textContent = 'Por favor, ingresa tu correo electrónico.';
        mensajeElement.style.color = 'red';
        return;
    }

    // Limpiar mensaje previo
    mensajeElement.textContent = 'Enviando código...';
    mensajeElement.style.color = 'gray';

    try {
        const response = await fetch(`${API_URL}/enviar-codigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Correo }),
        });

        const data = await response.json();

        if (response.ok) {
            // Éxito: El servidor ha respondido correctamente
            mensajeElement.textContent = data.msg || 'Código enviado con éxito. Revisa tu bandeja de entrada.';
            mensajeElement.style.color = 'green';
            
            // Aquí puedes redirigir al usuario a la siguiente etapa 
            // donde ingresará el código y la nueva contraseña.
            // Ejemplo: window.location.href = '/verificar-codigo.html'; 

        } else {
            // Error en el lado del servidor (ej: 400 Bad Request o 500 Internal Server Error)
            mensajeElement.textContent = data.msg || 'Ocurrió un error al intentar enviar el código.';
            mensajeElement.style.color = 'red';
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        mensajeElement.textContent = 'Error de conexión con el servidor. Inténtalo de nuevo más tarde.';
        mensajeElement.style.color = 'red';
    }
};

// Adjuntar el manejador de eventos al formulario
form.addEventListener('submit', handleEnviarCodigo);