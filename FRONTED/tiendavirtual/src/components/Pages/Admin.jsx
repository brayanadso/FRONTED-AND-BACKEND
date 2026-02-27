// src/pages/Admin.jsx
// Panel de admin con CRUD completo de productos
// Imagen: subida desde el PC (Base64) con drag & drop

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:8081/api/productos";

// ── Componente uploader de imagen ─────────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten archivos de imagen.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleFileInput  = (e) => processFile(e.target.files[0]);
  const handleDrop       = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); };
  const handleDragOver   = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave  = () => setDragging(false);
  const handleRemove     = () => { onChange(""); if (inputRef.current) inputRef.current.value = ""; };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        Imagen del Producto *
      </label>

      {value ? (
        /* Preview de imagen con botones hover */
        <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-purple-200 bg-gray-50 group">
          <img src={value} alt="preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
            >
              Cambiar imagen
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
            >
              Quitar imagen
            </button>
          </div>
        </div>
      ) : (
        /* Zona drag & drop */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full h-44 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-all duration-200 ${
            dragging
              ? "border-purple-500 bg-purple-50 scale-[1.01]"
              : "border-gray-200 bg-gray-50 hover:border-purple-400 hover:bg-purple-50"
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dragging ? "bg-purple-100" : "bg-gray-100"}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={dragging ? "#7c3aed" : "#9ca3af"} strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div className="text-center">
            <p className={`text-sm font-semibold ${dragging ? "text-purple-600" : "text-gray-500"}`}>
              {dragging ? "¡Suelta la imagen aquí!" : "Arrastra una imagen o haz clic"}
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — máximo 5 MB</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}

// ── Componente principal AdminPanel ──────────────────────────────────────
export default function AdminPanel() {
  const { usuario, logout } = useAuth();

  const [productos, setProductos]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState("productos");
  const [editando, setEditando]     = useState(null);
  const [mensaje, setMensaje]       = useState({ tipo: "", texto: "" });

  const formInicial = { productId: "", Nombre: "", Descripcion: "", Precio: "", Image: "" };
  const [form, setForm] = useState(formInicial);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${usuario?.token}`,
  };

  useEffect(() => { fetchProductos(); }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProductos(data);
    } catch {
      mostrarMensaje("error", "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Image) {
      mostrarMensaje("error", "Debes seleccionar una imagen para el producto");
      return;
    }
    try {
      const url    = editando ? `${API_URL}/${editando._id}` : API_URL;
      const method = editando ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({ ...form, Precio: parseFloat(form.Precio) }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message); }
      mostrarMensaje("success", editando ? "Producto actualizado" : "Producto creado");
      setForm(formInicial);
      setEditando(null);
      setActiveTab("productos");
      fetchProductos();
    } catch (err) {
      mostrarMensaje("error", err.message || "Error al guardar producto");
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error();
      mostrarMensaje("success", "Producto eliminado");
      fetchProductos();
    } catch {
      mostrarMensaje("error", "Error al eliminar producto");
    }
  };

  const handleEditar = (prod) => {
    setEditando(prod);
    setForm({
      productId:   prod.productId   || "",
      Nombre:      prod.Nombre      || "",
      Descripcion: prod.Descripcion || "",
      Precio:      prod.Precio?.toString() || "",
      Image:       prod.Image       || "",
    });
    setActiveTab("agregar");
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setForm(formInicial);
    setActiveTab("productos");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">

      {/* ── Header ── */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Panel Administrativo</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-gray-800">{usuario?.Nombre} {usuario?.Apellido}</p>
              <p className="text-xs text-purple-500 font-medium">Administrador</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Tarjetas estadísticas ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Productos */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="bg-white/20 p-2.5 rounded-lg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-4xl font-bold">{productos.length}</span>
            </div>
            <p className="font-semibold">Productos</p>
            <p className="text-blue-100 text-xs mt-1">En catálogo</p>
          </div>
          {/* Pedidos */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="bg-white/20 p-2.5 rounded-lg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-4xl font-bold">–</span>
            </div>
            <p className="font-semibold">Pedidos hoy</p>
            <p className="text-green-100 text-xs mt-1">Ver en panel de pedidos</p>
          </div>
          {/* Usuarios */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="bg-white/20 p-2.5 rounded-lg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <span className="text-4xl font-bold">–</span>
            </div>
            <p className="font-semibold">Usuarios</p>
            <p className="text-purple-100 text-xs mt-1">Registrados</p>
          </div>
        </div>

        {/* ── Mensaje feedback ── */}
        {mensaje.texto && (
          <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            mensaje.tipo === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {mensaje.tipo === "success" ? "✅" : "❌"} {mensaje.texto}
          </div>
        )}

        {/* ── Panel con Tabs ── */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Tabs header */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setActiveTab("productos"); cancelarEdicion(); }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "productos"
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📦 Productos ({productos.length})
            </button>
            <button
              onClick={() => { setActiveTab("agregar"); if (!editando) setForm(formInicial); }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                activeTab === "agregar"
                  ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {editando ? "✏️ Editar Producto" : "➕ Agregar Producto"}
            </button>
          </div>

          {/* ── Tab: Lista de productos ── */}
          {activeTab === "productos" && (
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : productos.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-5xl mb-3">📭</p>
                  <p className="font-semibold text-lg">No hay productos aún</p>
                  <button
                    onClick={() => setActiveTab("agregar")}
                    className="mt-4 text-purple-600 font-medium hover:underline"
                  >
                    Agregar el primer producto →
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                        <th className="pb-3 pl-2">Producto</th>
                        <th className="pb-3">Descripción</th>
                        <th className="pb-3">Precio</th>
                        <th className="pb-3 text-right pr-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {productos.map((prod) => (
                        <tr key={prod._id} className="hover:bg-gray-50 transition-colors">
                          {/* Imagen + Nombre + ID */}
                          <td className="py-3.5 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                {prod.Image
                                  ? <img src={prod.Image} alt={prod.Nombre} className="w-full h-full object-cover" onError={e => e.currentTarget.style.display = "none"} />
                                  : <div className="flex items-center justify-center h-full text-lg">📦</div>
                                }
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{prod.Nombre}</p>
                                <p className="text-xs text-gray-400">ID: {prod.productId}</p>
                              </div>
                            </div>
                          </td>
                          {/* Descripción */}
                          <td className="py-3.5 text-gray-500 max-w-xs">
                            <p className="truncate">{prod.Descripcion}</p>
                          </td>
                          {/* Precio */}
                          <td className="py-3.5 font-bold text-gray-800">
                            ${parseFloat(prod.Precio).toLocaleString("es-CO")}
                          </td>
                          {/* Acciones */}
                          <td className="py-3.5 pr-2">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditar(prod)}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleEliminar(prod._id)}
                                className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Agregar / Editar ── */}
          {activeTab === "agregar" && (
            <div className="p-6 max-w-xl">
              <h3 className="font-bold text-gray-800 text-lg mb-6">
                {editando ? `Editando: ${editando.Nombre}` : "Nuevo Producto"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* ID y Precio */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      ID del Producto *
                    </label>
                    <input
                      type="text"
                      value={form.productId}
                      required
                      onChange={e => setForm({ ...form, productId: e.target.value })}
                      placeholder="ej: PROD-001"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Precio *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.Precio}
                      required
                      onChange={e => setForm({ ...form, Precio: e.target.value })}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
                    />
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={form.Nombre}
                    required
                    onChange={e => setForm({ ...form, Nombre: e.target.value })}
                    placeholder="Nombre del producto"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Descripción *
                  </label>
                  <textarea
                    value={form.Descripcion}
                    required
                    rows={3}
                    onChange={e => setForm({ ...form, Descripcion: e.target.value })}
                    placeholder="Descripción del producto"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition resize-none"
                  />
                </div>

                {/* Imagen */}
                <ImageUploader
                  value={form.Image}
                  onChange={(base64) => setForm({ ...form, Image: base64 })}
                />

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    {editando ? "💾 Guardar Cambios" : "➕ Crear Producto"}
                  </button>
                  {editando && (
                    <button
                      type="button"
                      onClick={cancelarEdicion}
                      className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}