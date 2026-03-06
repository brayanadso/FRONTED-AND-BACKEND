import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, Loader2, PackageX } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [added, setAdded]       = useState({});
  const { addToCart }           = useCart();

  useEffect(() => {
    axios.get("http://localhost:8081/api/productos")
      .then(({ data }) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

  function handleAddToCart(product) {
    addToCart(product);
    setAdded(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 1500);
  }

  if (loading) return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-gray-400">Cargando productos...</p>
      </div>
    </section>
  );

  if (products.length === 0) return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center py-20">
        <PackageX className="w-14 h-14 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Sin productos disponibles</h2>
        <p className="text-gray-400">El administrador aún no ha agregado productos.</p>
      </div>
    </section>
  );

  return (
    <section id="productos" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Productos Destacados</h2>
          <p className="text-gray-600 text-lg">Los productos más populares de nuestra tienda</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id}
              className="border rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-56 overflow-hidden">
                <img src={product.Image || product.Imagen} alt={product.Nombre}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = "https://placehold.co/400x300?text=Sin+imagen"; }} />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{product.Nombre}</h3>
                <p className="text-gray-600 mb-4 flex-1 text-sm">{product.Descripcion || product.DescripCion}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(product.Precio)}</span>
                  <button onClick={() => handleAddToCart(product)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
                      added[product._id]
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    }`}>
                    <ShoppingCart className="w-4 h-4" />
                    {added[product._id] ? "¡Agregado!" : "Comprar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;