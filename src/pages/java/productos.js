const API_URL = 'http://localhost:8081/api/productos';

async function cargarProductos() {
    try {
        const response = await fetch(API_URL);
        const Productos = await response.json();

        console.log('Productos recibidos:', Productos); // Para debug

        const grid = document.getElementById('product-grid'); // ✅ ID correcto
        
        if (!grid) {
            console.error('❌ No se encontró el contenedor product-grid');
            return;
        }

        grid.innerHTML = Productos.map(Producto => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card"
                data-category="laptops"
                data-price="${Producto.Precio}"
                data-product-Id="${Producto.productId}">

                <div class="bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden relative">
                    <img src="${Producto.Imagen}" alt="${Producto.Nombre}"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/400x300?text=Imagen+no+disponible'">

                    <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"> 
                        -15% 
                    </div>
                </div> 

                <div class="p-6">
                    <h3 class="text-lg font-bold text-gray-800">
                        ${Producto.Nombre}
                    </h3>

                    <p class="text-sm text-gray-600 mb-4">
                        ${Producto.DescripCion}
                    </p>

                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <span class="text-2xl font-bold text-blue-600">
                                $${(Producto.Precio || 0).toLocaleString('es-CO')}
                            </span>
                        </div>

                        <div class="flex text-yellow-400">
                            ⭐⭐⭐⭐⭐
                        </div>
                    </div>

                    <div class="flex space-x-2">
                        <button class="ver-detalles-btn bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-300 flex-1 text-sm">
                            Ver Detalles
                        </button>

                        <button class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm">
                            Comprar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        console.log("✅ Productos cargados con éxito:", Productos.length);
    } catch (error) {
        console.error("❌ Error al cargar los productos:", error);
        const grid = document.getElementById('product-grid');
        if (grid) {
            grid.innerHTML = '<p class="col-span-4 text-center text-red-600">Error al cargar productos. Verifica que el servidor esté corriendo.</p>';
        }
    }
}

// Cargar productos al inicio
cargarProductos();

// Recargar productos cada 5 segundos (puedes comentar estas líneas si no quieres auto-recargar)
setInterval(() => {
    cargarProductos();
}, 5000);