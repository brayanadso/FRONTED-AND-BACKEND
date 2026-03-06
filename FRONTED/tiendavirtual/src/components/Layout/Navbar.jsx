import { useState, useEffect, useRef } from "react";
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import CarritoSidebar from "../Cart/CarritoSidebar.jsx";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usuario, setUsuario]               = useState(null);
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const [carritoOpen, setCarritoOpen]       = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const { totalItems } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) setUsuario(JSON.parse(stored));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setUsuario(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">

            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg mr-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TechStore Pro
                </h1>
              </Link>
              <div className="hidden md:flex space-x-6">
                {["Inicio", "Productos", "Categorias", "Contacto"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">
                    {item}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Carrito */}
              <button onClick={() => setCarritoOpen(true)}
                className="relative group p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-105">
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-all duration-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </button>

              {usuario ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {usuario.Nombre?.charAt(0).toUpperCase()}{usuario.Apellido?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{usuario.Nombre} {usuario.Apellido}</p>
                        <p className="text-xs text-gray-500 truncate">{usuario.Correo}</p>
                        {usuario.rol === "admin" && (
                          <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
                        )}
                      </div>
                      <Link to="/perfil" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <User className="w-4 h-4" /> Mi Perfil
                      </Link>
                      {usuario.rol === "admin" && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                          <Settings className="w-4 h-4" /> Panel Admin
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-sm hover:scale-105 transition-all duration-300">
                    <User className="w-4 h-4" />
                    <span className="hidden md:block">Iniciar sesión</span>
                  </div>
                </Link>
              )}

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-300">
                {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                {["Inicio", "Productos", "Categorias", "Contacto"].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2">
                    {item}
                  </a>
                ))}
                {usuario ? (
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium py-2">
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-blue-600 font-medium py-2">
                    <User className="w-4 h-4" /> Iniciar sesión
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      <CarritoSidebar open={carritoOpen} onClose={() => setCarritoOpen(false)} />
    </>
  );
}

export default Navbar;