import { useState } from "react";

function FeaturedProducts() {
  const [cart, setCart] = useState([]);

  const products = [
    {
      id: "macbook-pro-m3",
      name: "MacBook Pro M3",
      description: "Potencia profesional para creativos y desarrolladores",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
      price: 2499000,
      originalPrice: 2899000,
      discount: "-15%",
      rating: 5,
      reviews: 128,
      badge: "discount",
    },
    {
      id: "iphone-15-pro",
      name: "iPhone 15 Pro",
      description: "El smartphone más avanzado con chip A17 Pro",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
      price: 1199000,
      originalPrice: null,
      discount: null,
      rating: 5,
      reviews: 89,
      badge: "new",
    },
    {
      id: "rtx-4070-super",
      name: "RTX 4070 Super",
      description: "Tarjeta gráfica de nueva generación para gaming",
      image:
        "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=600",
      price: 599000,
      originalPrice: 749000,
      discount: "-20%",
      rating: 5,
      reviews: 156,
      badge: "discount",
    },
  ];

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    console.log(`Producto agregado: ${product.name}`);
    alert(`${product.name} agregado al carrito`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Productos Destacados</h2>
          <p className="text-gray-600 text-lg">
            Los productos más populares de nuestra tienda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
            >
              {/* Imagen */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {product.badge === "discount" && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    {product.discount}
                  </div>
                )}

                {product.badge === "new" && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    NUEVO
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">
                  {product.name}
                </h3>

                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"⭐".repeat(product.rating)}
                  </div>
                  <span className="text-gray-500 text-sm ml-2">
                    ({product.reviews} reseñas)
                  </span>
                </div>

                {/* Precio */}
                <div className="flex justify-between items-center">
                  <div>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-sm block">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ver más */}
        <div className="text-center mt-12">
          <a
            href="#productos"
            className="inline-block bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition duration-300 transform hover:scale-105"
          >
            Ver Todos los Productos
          </a>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
