const API_URL = 'http://localhost:8081/api/users/register';

const form = document.getElementById('register-form');

console.log('✅ Script cargado');
console.log('📝 Formulario encontrado:', form);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('🚀 Formulario enviado');
    
    // Obtener datos del formulario
    const datos = {
        Nombre: document.getElementById('nombre').value.trim(),
        Apellido: document.getElementById('apellido').value.trim(),
        Telefono: document.getElementById('telefono').value.trim(),
        Correo: document.getElementById('correo').value.trim(),
        Password: document.getElementById('password').value
    };
    
    console.log('📤 Datos:', datos);
    
    // Validación
    if (datos.Password.length < 6) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseña muy corta',
            text: 'La contraseña debe tener al menos 6 caracteres',
            showConfirmButton: true
        });
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        console.log('📥 Respuesta:', data);
        
        if (response.ok) {
            // ✅ Éxito
            Swal.fire({
                icon: 'success',
                title: '¡Cuenta creada!',
                text: 'Redirigiendo al login...',
                timer: 1500,
                showConfirmButton: false
            });

            form.reset();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } else {
            // ❌ Error del servidor (correo duplicado, campos inválidos, etc)
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: data.message || 'Intenta nuevamente'
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor'
        });
    }
});
