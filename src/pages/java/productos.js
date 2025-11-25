const API_URL = 'http://localhost:8081/api/productos';

async function cargarProductos() {
    try {
        const response = await fetch(API_URL);
        const productos = await response.json();

        console.log('Productos recibidos:', productos);

        const grid = document.getElementById('product-grid');
        
        if (!grid) {
            console.error('❌ No se encontró el contenedor product-grid');
            return;
        }

        if (!productos || productos.length === 0) {
            grid.innerHTML = '<p class="col-span-4 text-center text-gray-600">No hay productos disponibles.</p>';
            return;
        }

        grid.innerHTML = productos.map(producto => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card"
                data-category="${producto.Categoria || 'sin-categoria'}"
                data-price="${producto.Precio}"
                data-product-id="${producto.productId || producto._id}">

                <div class="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden relative">
                    <img src="${producto.Imagen || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}" 
                         alt="${producto.Nombre}"
                         class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                         loading="lazy"
                         onerror="this.src='https://via.placeholder.com/400x300?text=Imagen+no+disponible'">

                    <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"> 
                        -15% 
                    </div>
                    
                    ${producto.Stock <= 5 ? `
                        <div class="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            ¡Últimas ${producto.Stock} unidades!
                        </div>
                    ` : ''}
                </div> 

                <div class="p-6">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">
                        ${producto.Nombre}
                    </h3>

                    <p class="text-sm text-gray-600 mb-4 line-clamp-2">
                        ${producto.DescripCion || 'Sin descripción'}
                    </p>

                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <span class="text-2xl font-bold text-blue-600">
                                $${(producto.Precio || 0).toLocaleString('es-CO')}
                            </span>
                            <p class="text-xs text-gray-500">Stock: ${producto.Stock || 0}</p>
                        </div>

                        <div class="flex text-yellow-400 text-sm">
                            ⭐⭐⭐⭐⭐
                        </div>
                    </div>

                    <div class="flex space-x-2">
                        <button onclick="verDetalles('${producto._id || producto.productId}')"
                                class="ver-detalles-btn bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-300 flex-1 text-sm">
                            Ver Detalles
                        </button>

                        <button onclick="agregarAlCarrito('${producto._id || producto.productId}')"
                                class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm">
                            Comprar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log("✅ Productos cargados con éxito:", productos.length);
        
    } catch (error) {
        console.error("❌ Error al cargar los productos:", error);
        const grid = document.getElementById('product-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-4 text-center p-8">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar productos</h3>
                        <p class="text-red-600">Verifica que el servidor esté corriendo en http://localhost:8081</p>
                    </div>
                </div>
            `;
        }
    }
}

// Función para ver detalles del producto
function verDetalles(productId) {
    console.log('Ver detalles del producto:', productId);
    // TODO: Implementar modal o redirección a página de detalles
    alert(`Ver detalles del producto ID: ${productId}`);
}

// Función para agregar al carrito
function agregarAlCarrito(productId) {
    console.log('Agregar al carrito:', productId);
    
    // Obtener carrito actual
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.cantidad++;
    } else {
        cart.push({ productId, cantidad: 1 });
    }
    
    // Guardar carrito
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion('Producto agregado al carrito');
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
    
    const counter = document.getElementById('cart-counter');
    if (counter) {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl z-50 transform translate-x-0 transition-all duration-300';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span class="font-semibold">${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cargar productos al inicio
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarContadorCarrito();
});

// ⚠️ OPCIONAL: Recargar productos cada 30 segundos
// Descomenta si quieres que los productos se actualicen automáticamente
/*
setInterval(() => {
    cargarProductos();
}, 30000);
*/