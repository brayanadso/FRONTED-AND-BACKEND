async function cargarProductos() {
    try{
        const response= await fetch('http://localhost:8081/api/productos');
        const Productos=await response.json();

        const grid= document.getElementById('products-grid');
              grid.innerHTML=Productos.map(Producto=>`

                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card"
                    data-category="laptops"
                    data-price="${Producto.precio}"
                    data-product-Id="${Producto.productId}">

                <div class="bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden">
                <img src="${Producto.imagen}" alt="${Producto.Nombre}"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy">

                <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"> 
                -15% 
                </div>
                </div> 

                <div class="p-6">
                <h3 class="text-lg font-bold text-gray-800">
                ${Producto.Nombre}
                </h3>

                <p class="text-sm text-gray-800 mb-4">
                ${Producto.Descripcion}
                </p>

                <div class="flex items-center justify-between mb-4">
                <div>
                <span class ="text-2xl font-bold text-blue-600">
                ${(Producto.Precio || 0) .toLocaleString('es-CO')}
                </span>
                </div>

                <div class="flex text-yellow-600">
                ⭐️⭐️⭐️⭐️⭐️
                </div>
                </div>

                <div class="flex space-x-2">
                <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
                Ver Detalles
                </button>

                

                <button class="add-to-cart-btn  bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex-1 text-sm">
                Comprar
                </button>
                </div>
                </div>
                </div>


                ` ).join('');
                console.log("productos cargados con exito");
    } catch (error){
        console.error("error al cargar los productos", error);
}
}

//
cargarProductos();

//cargue automaticamente el producto en html
setInterval(() => {
    cargarProductos();
}, 5000); // 5000 ms = 5 segundos