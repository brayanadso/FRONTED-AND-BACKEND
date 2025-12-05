const API_URL = 'http://localhost:8081/api/users/registro'; // ← CORREGIDO

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
    
    console.log('📤 Datos a enviar:', datos);
    
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
        console.log('🌐 Enviando petición a:', API_URL);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        console.log('📥 Respuesta del servidor:', data);
        
        if (response.ok) {
            // ✅ Éxito
            Swal.fire({
                icon: 'success',
                title: '¡Cuenta creada exitosamente!',
                text: 'Redirigiendo al login...',
                timer: 2000,
                showConfirmButton: false
            });

            form.reset();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } else {
            // ❌ Error del servidor (correo duplicado, campos inválidos, etc)
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: data.message || data.error || 'Intenta nuevamente',
                confirmButtonColor: '#8B5CF6'
            });
        }
        
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 8081',
            confirmButtonColor: '#8B5CF6'
        });
    }
});