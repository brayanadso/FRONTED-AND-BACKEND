import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(product) {
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        return prev.map(i => i._id === product._id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  }

  function removeFromCart(id) {
    setCartItems(prev => prev.filter(i => i._id !== id));
  }

  function updateQuantity(id, cantidad) {
    if (cantidad < 1) { removeFromCart(id); return; }
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, cantidad } : i));
  }

  function clearCart() { setCartItems([]); }

  const totalItems = cartItems.reduce((sum, i) => sum + i.cantidad, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + (i.Precio * i.cantidad), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}