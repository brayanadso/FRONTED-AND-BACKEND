// perfil.js - Sistema de menú de usuario con iniciales

document.addEventListener('DOMContentLoaded', function() {
    const usuarioGuardado = localStorage.getItem('usuario');
    const userMenuContainer = document.getElementById('user-menu-container');
    const loginIcon = document.getElementById('login-icon'); // Ícono de login
    
    if (!userMenuContainer) {
        console.error('❌ No se encontró el contenedor del menú de usuario');
        return;
    }
    
    if (usuarioGuardado) {
        try {
            const usuario = JSON.parse(usuarioGuardado);
            console.log('✅ Usuario logueado:', usuario);
            
            // 🔴 OCULTAR EL ÍCONO DE LOGIN
            if (loginIcon) {
                loginIcon.style.display = 'none';
            }
            
            // Obtener iniciales
            const iniciales = obtenerIniciales(usuario.Nombre, usuario.Apellido);
            
            // Crear menú de usuario
            userMenuContainer.innerHTML = `
                <div class="relative">
                    <!-- Botón con iniciales -->
                    <button id="user-menu-btn" 
                            class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                        ${iniciales}
                    </button>
                    
                    <!-- Menú desplegable (oculto por defecto) -->
                    <div id="user-dropdown" 
                         class="hidden absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                        
                        <!-- Header del menú -->
                        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white ">
                            <p class="font-semibold text-sm">${usuario.Nombre} ${usuario.Apellido}</p>
                            <p class="text-xs opacity-90">${usuario.Correo}</p>
                        </div>
                        
                        <!-- Opciones -->
                        <div class="py-2">
                            <a href="perfil.html" 
                               class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200">
                                <svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                Ver Perfil
                            </a>
                            
                            <button id="logout-btn" 
                                    class="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 text-left">
                                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                </svg>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Event listeners
            const userMenuBtn = document.getElementById('user-menu-btn');
            const userDropdown = document.getElementById('user-dropdown');
            const logoutBtn = document.getElementById('logout-btn');
            
            // Toggle menú
            userMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });
            
            // Cerrar menú al hacer click fuera
            document.addEventListener('click', function(e) {
                if (!userMenuContainer.contains(e.target)) {
                    userDropdown.classList.add('hidden');
                }
            });
            
            // Cerrar sesión
            logoutBtn.addEventListener('click', function() {
                cerrarSesion();
            });
            
        } catch (error) {
            console.error('❌ Error al cargar usuario:', error);
        }
    } else {
        console.log('ℹ️ No hay usuario logueado');
        // 🔵 MOSTRAR EL ÍCONO DE LOGIN si no hay usuario
        if (loginIcon) {
            loginIcon.style.display = 'block';
        }
    }
});

// Función para obtener iniciales
function obtenerIniciales(nombre, apellido) {
    const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : '';
    const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : '';
    return inicial1 + inicial2;
}

// Función para cerrar sesión
function cerrarSesion() {
    // Limpiar localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('cart'); // Opcional: limpiar carrito
    
    // Mostrar toast de confirmación
    const toast = document.getElementById('logout-toast');
    if (toast) {
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.remove('opacity-0');
            toast.classList.add('opacity-100');
        }, 10);
        
        // Ocultar después de 2 segundos
        setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
        }, 2000);
    }
    
    // Redirigir al login después de 2.5 segundos
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2500);
}