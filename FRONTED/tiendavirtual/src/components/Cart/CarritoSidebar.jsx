import { X, ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function CarritoSidebar({ open, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

  return (
    <>
      {open && <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Mi Carrito</h2>
            {totalItems > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-1">Agrega productos para continuar</p>
              <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                Ver productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item._id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                    <img src={item.Image || item.Imagen} alt={item.Nombre} className="w-full h-full object-cover"
                      onError={e => { e.target.src = "https://placehold.co/64x64?text=?"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{item.Nombre}</p>
                    <p className="text-blue-600 font-bold text-sm mt-0.5">{formatPrice(item.Precio)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold w-5 text-center">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                    <p className="text-sm font-bold text-gray-700">{formatPrice(item.Precio * item.cantidad)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total ({totalItems} productos)</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition shadow-md">
              Proceder al pago
            </button>
            <button onClick={clearCart} className="w-full text-sm text-red-500 hover:text-red-600 font-medium transition">
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}