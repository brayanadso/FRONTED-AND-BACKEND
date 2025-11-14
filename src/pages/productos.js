// Función para cargar productos
async function cargarProductos() {
  try {
    const response = await fetch('http://localhost:8081/api/productos');
    const productos = await response.json();
    
    const grid = document.getElementById('products-grid');
    grid.innerHTML = productos.map(producto => `
      
     <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card" 
     data-category="laptops" 
     data-price="${producto.Precio}" 
     data-product-id="${producto.productId}">
  
  <!-- Imagen del producto -->
  <div class="bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center relative overflow-hidden">
    <img src="${producto.Imagen}" 
         alt="${producto.Nombre}" 
         class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
         loading="lazy">
    
    <!-- Etiqueta de descuento -->
    <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
      -15%
    </div>
  </div>
  
  <!-- Contenido del producto -->
  <div class="p-6">
    <!-- Título -->
    <h3 class="text-lg font-bold mb-2 text-gray-800">
      ${producto.Nombre}
    </h3>
    
    <!-- Descripción -->
    <p class="text-sm text-gray-600 mb-4">
      ${producto.Descripcion}
    </p>
    
    <!-- Precio y calificación -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <span class="text-2xl font-bold text-blue-600">
          $${(producto.Precio || 0).toLocaleString('es-CO')}
        </span>
      </div>
      <div class="flex text-yellow-400">
        ★★★★★
      </div>
    </div>
    
    <!-- Botones de acción -->
    <div class="flex space-x-2">
      <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
        Ver Detalles
      </button>
      <button class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm">
        Comprar
      </button>
    </div>
  </div>
  
</div>
    `).join('');
    console.log('Productos cargados correctamente');
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

// Llamar la función cuando cargue la página
cargarProductos();

setInterval(() => {
  cargarProductos();
}, 5000); // 5000 ms = 5 segundos

