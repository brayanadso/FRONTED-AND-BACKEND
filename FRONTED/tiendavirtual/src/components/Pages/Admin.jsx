import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard, Package, PlusCircle, LogOut,
  Trash2, Save, X, Upload, ShoppingBag,
  Users, ClipboardList, ImagePlus, CheckCircle,
  AlertCircle, Loader2, TrendingUp, UserX, CheckSquare
} from "lucide-react";

const API = "http://localhost:8081/api";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]               = useState("dashboard");
  const [usuario, setUsuario]                   = useState(null);
  const [productos, setProductos]               = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [usuarios, setUsuarios]                 = useState([]);
  const [pedidos, setPedidos]                   = useState([]);
  const [loadingPedidos, setLoadingPedidos]     = useState(false);
  const [form, setForm]                         = useState({ Nombre: "", Descripcion: "", Precio: "", Image: "" });
  const [imagenPreview, setImagenPreview]       = useState(null);
  const [loadingForm, setLoadingForm]           = useState(false);
  const [formMsg, setFormMsg]                   = useState({ type: "", text: "" });
  const fileRef = useRef();

  // ── Auth Guard ──────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (!stored) { navigate("/login"); return; }
    const u = JSON.parse(stored);
    if (u.rol !== "admin") { navigate("/"); return; }
    setUsuario(u);
  }, []);

  useEffect(() => {
    fetchProductos();
    fetchUsuarios();
    fetchPedidos();
  }, []);

  async function fetchProductos() {
    setLoadingProductos(true);
    try {
      const { data } = await axios.get(`${API}/productos`);
      setProductos(Array.isArray(data) ? data : []);
    } catch { setProductos([]); }
    finally { setLoadingProductos(false); }
  }

  async function fetchUsuarios() {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(data.data || []);
    } catch { setUsuarios([]); }
  }

  async function fetchPedidos() {
    setLoadingPedidos(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API}/admin/pedidos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(data.data || []);
    } catch { setPedidos([]); }
    finally { setLoadingPedidos(false); }
  }

  // ── Confirmar compra (pendiente → completado) ───────────────
  async function handleConfirmarCompra(id) {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API}/admin/pedidos/${id}/estado`,
        { estado: "completado" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPedidos(prev => prev.map(p => p._id === id ? { ...p, estado: "completado" } : p));
    } catch (err) {
      alert(err.response?.data?.message || "Error al confirmar el pedido");
    }
  }

  // ── Cancelar pedido ─────────────────────────────────────────
  async function handleCancelarPedido(id) {
    if (!window.confirm("¿Cancelar este pedido?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${API}/admin/pedidos/${id}/estado`,
        { estado: "cancelado" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPedidos(prev => prev.map(p => p._id === id ? { ...p, estado: "cancelado" } : p));
    } catch (err) {
      alert(err.response?.data?.message || "Error al cancelar el pedido");
    }
  }

  // ── Eliminar usuario ────────────────────────────────────────
  async function handleEliminarUsuario(id) {
    if (!window.confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/admin/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar usuario");
    }
  }

  // ── Imagen ──────────────────────────────────────────────────
  function handleImageFile(file) {
    if (!file) return;
    setFormMsg({ type: "", text: "" });
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 500;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const r = Math.min(MAX / width, MAX / height);
          width  = Math.round(width  * r);
          height = Math.round(height * r);
        }
        const canvas = document.createElement("canvas");
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.55);
        const kb = Math.round(compressed.length * 0.75 / 1024);
        if (kb > 400) {
          setFormMsg({ type: "error", text: `Imagen muy grande (${kb} KB). Usa una URL https://.` });
          return;
        }
        setImagenPreview(compressed);
        setForm(f => ({ ...f, Image: compressed }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleImageFile(e.dataTransfer.files[0]);
  }

  // ── Guardar producto ────────────────────────────────────────
  async function handleGuardar(e) {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    const imagenFinal = imagenPreview || form.Image;
    if (!form.Nombre.trim() || !form.Descripcion.trim() || !form.Precio || !imagenFinal) {
      return setFormMsg({ type: "error", text: "Todos los campos son obligatorios, incluyendo la imagen." });
    }
    setLoadingForm(true);
    try {
      const payload = {
        productId:   `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        Nombre:      form.Nombre.trim(),
        Descripcion: form.Descripcion.trim(),
        Precio:      parseFloat(form.Precio),
        Image:       imagenFinal,
      };
      await axios.post(`${API}/productos`, payload);
      setFormMsg({ type: "success", text: "Producto guardado correctamente." });
      setForm({ Nombre: "", Descripcion: "", Precio: "", Image: "" });
      setImagenPreview(null);
      await fetchProductos();
      setTimeout(() => { setActiveTab("productos"); setFormMsg({ type: "", text: "" }); }, 1500);
    } catch (err) {
      setFormMsg({ type: "error", text: err.response?.data?.message || err.message || "Error desconocido." });
    } finally {
      setLoadingForm(false);
    }
  }

  // ── Eliminar producto ───────────────────────────────────────
  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await axios.delete(`${API}/productos/${id}`);
      setProductos(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo eliminar el producto.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (!usuario) return null;

  const pedidosPendientes = pedidos.filter(p => p.estado === "pendiente").length;

  const stats = [
    { label: "Productos", value: productos.length, sub: "En catálogo",      icon: <Package className="w-7 h-7" />,      color: "from-blue-500 to-blue-700" },
    { label: "Pedidos",   value: pedidos.length,   sub: `${pedidosPendientes} pendientes`, icon: <ClipboardList className="w-7 h-7" />, color: "from-emerald-500 to-emerald-700" },
    { label: "Usuarios",  value: usuarios.length,  sub: "Registrados",      icon: <Users className="w-7 h-7" />,        color: "from-violet-500 to-violet-700" },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard",                         icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "productos", label: `Productos (${productos.length})`,   icon: <Package className="w-4 h-4" /> },
    { id: "agregar",   label: "Agregar producto",                  icon: <PlusCircle className="w-4 h-4" /> },
    { id: "pedidos",   label: `Pedidos${pedidosPendientes > 0 ? ` (${pedidosPendientes} 🔴)` : ""}`, icon: <ClipboardList className="w-4 h-4" /> },
    { id: "usuarios",  label: `Usuarios (${usuarios.length})`,     icon: <Users className="w-4 h-4" /> },
  ];

  const estadoBadge = (estado) => {
    const map = {
      pendiente:  "bg-yellow-100 text-yellow-700",
      completado: "bg-green-100 text-green-700",
      cancelado:  "bg-red-100 text-red-600",
    };
    return map[estado] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Panel Administrativo</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">{usuario.Nombre} {usuario.Apellido}</p>
              <p className="text-xs text-violet-600 font-medium">Administrador</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {usuario.Nombre?.charAt(0)}{usuario.Apellido?.charAt(0)}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                {s.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm font-semibold text-gray-700">{s.label}</p>
                <p className="text-xs text-gray-400">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-violet-600 text-violet-700 bg-violet-50"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Resumen del sistema</h3>
                <p className="text-gray-400 text-sm mb-6">Gestiona tu tienda desde las pestañas de arriba.</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button onClick={() => setActiveTab("productos")} className="px-5 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition">
                    Ver productos
                  </button>
                  <button onClick={() => setActiveTab("pedidos")} className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition">
                    Ver pedidos {pedidosPendientes > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pedidosPendientes}</span>}
                  </button>
                  <button onClick={() => setActiveTab("agregar")} className="px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">
                    Agregar producto
                  </button>
                </div>
              </div>
            )}

            {/* PRODUCTOS */}
            {activeTab === "productos" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Catálogo de productos</h2>
                  <button onClick={() => setActiveTab("agregar")} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">
                    <PlusCircle className="w-4 h-4" /> Nuevo producto
                  </button>
                </div>

                {loadingProductos ? (
                  <div className="text-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-violet-400" />
                    <p className="text-gray-400 text-sm">Cargando productos...</p>
                  </div>
                ) : productos.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No hay productos aún.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                          <th className="px-4 py-3 text-left">Imagen</th>
                          <th className="px-4 py-3 text-left">Producto</th>
                          <th className="px-4 py-3 text-left">Descripción</th>
                          <th className="px-4 py-3 text-right">Precio</th>
                          <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {productos.map(p => (
                          <tr key={p._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                                {(p.Image || p.Imagen)
                                  ? <img src={p.Image || p.Imagen} alt={p.Nombre} className="w-full h-full object-cover" />
                                  : <ImagePlus className="w-5 h-5 text-gray-300" />}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-800">{p.Nombre}</td>
                            <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{p.Descripcion || p.DescripCion}</td>
                            <td className="px-4 py-3 text-right font-bold text-blue-600">
                              ${Number(p.Precio).toLocaleString("es-CO")}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => handleEliminar(p._id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition">
                                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
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

            {/* PEDIDOS */}
            {activeTab === "pedidos" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Gestión de pedidos</h2>
                  {pedidosPendientes > 0 && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      {pedidosPendientes} pendiente{pedidosPendientes > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {loadingPedidos ? (
                  <div className="text-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-violet-400" />
                    <p className="text-gray-400 text-sm">Cargando pedidos...</p>
                  </div>
                ) : pedidos.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No hay pedidos aún.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidos.map(pedido => (
                      <div key={pedido._id} className={`border rounded-2xl p-5 transition ${
                        pedido.estado === "pendiente" ? "border-yellow-200 bg-yellow-50" :
                        pedido.estado === "completado" ? "border-green-200 bg-green-50" :
                        "border-red-200 bg-red-50"
                      }`}>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${estadoBadge(pedido.estado)}`}>
                                {pedido.estado.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-400">#{pedido._id.slice(-8).toUpperCase()}</span>
                            </div>
                            <p className="font-semibold text-gray-800">{pedido.nombreCliente}</p>
                            <p className="text-sm text-gray-500">📞 {pedido.telefono}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(pedido.fecha).toLocaleDateString("es-CO", {
                                year: "numeric", month: "long", day: "numeric",
                                hour: "2-digit", minute: "2-digit"
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              ${Number(pedido.total).toLocaleString("es-CO")}
                            </p>
                            <p className="text-xs text-gray-400">{pedido.productos?.length} producto(s)</p>
                          </div>
                        </div>

                        {/* Productos del pedido */}
                        <div className="mt-3 pt-3 border-t border-white border-opacity-60">
                          <div className="space-y-1">
                            {pedido.productos?.map((prod, i) => (
                              <div key={i} className="flex justify-between text-sm text-gray-600">
                                <span>{prod.nombre} x{prod.cantidad}</span>
                                <span className="font-medium">${Number(prod.precio * prod.cantidad).toLocaleString("es-CO")}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Botones solo para pendientes */}
                        {pedido.estado === "pendiente" && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => handleConfirmarCompra(pedido._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
                            >
                              <CheckSquare className="w-4 h-4" />
                              Confirmar compra
                            </button>
                            <button
                              onClick={() => handleCancelarPedido(pedido._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl text-sm font-semibold transition"
                            >
                              <X className="w-4 h-4" />
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* USUARIOS */}
            {activeTab === "usuarios" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Usuarios registrados</h2>
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
                    {usuarios.length} total
                  </span>
                </div>

                {usuarios.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No hay usuarios registrados.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                          <th className="px-4 py-3 text-left">Usuario</th>
                          <th className="px-4 py-3 text-left">Correo</th>
                          <th className="px-4 py-3 text-left">Teléfono</th>
                          <th className="px-4 py-3 text-center">Rol</th>
                          <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {usuarios.map(u => (
                          <tr key={u._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {u.Nombre?.charAt(0)}{u.Apellido?.charAt(0)}
                                </div>
                                <span className="font-semibold text-gray-800">{u.Nombre} {u.Apellido}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{u.Correo}</td>
                            <td className="px-4 py-3 text-gray-500">{u.Telefono || "—"}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                u.rol === "admin"
                                  ? "bg-violet-100 text-violet-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                {u.rol}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end">
                                {u._id !== usuario._id ? (
                                  <button onClick={() => handleEliminarUsuario(u._id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition">
                                    <UserX className="w-3.5 h-3.5" /> Eliminar
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-400 italic px-3">Tú</span>
                                )}
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

            {/* AGREGAR PRODUCTO */}
            {activeTab === "agregar" && (
              <div className="max-w-xl mx-auto">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Agregar nuevo producto</h2>
                <form onSubmit={handleGuardar} className="space-y-5">

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del producto *</label>
                    <input value={form.Nombre} onChange={e => setForm(f => ({ ...f, Nombre: e.target.value }))}
                      placeholder="Ej: MacBook Pro M3" required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent text-gray-800 text-sm transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción *</label>
                    <textarea value={form.Descripcion} onChange={e => setForm(f => ({ ...f, Descripcion: e.target.value }))}
                      placeholder="Describe el producto..." required rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent text-gray-800 text-sm transition resize-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Precio (COP) *</label>
                    <input type="number" min="0" step="1" value={form.Precio}
                      onChange={e => setForm(f => ({ ...f, Precio: e.target.value }))}
                      placeholder="Ej: 2499000" required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent text-gray-800 text-sm transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Imagen del producto *</label>
                    <input type="url" value={imagenPreview ? "" : form.Image}
                      onChange={e => { setForm(f => ({ ...f, Image: e.target.value })); setImagenPreview(null); }}
                      placeholder="https://... (URL de la imagen)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent text-gray-800 text-sm transition mb-3" />

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium">O sube una imagen pequeña</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div onClick={() => fileRef.current?.click()} onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition">
                      {imagenPreview ? (
                        <div className="relative inline-block">
                          <img src={imagenPreview} alt="preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                          <button type="button"
                            onClick={ev => { ev.stopPropagation(); setImagenPreview(null); setForm(f => ({ ...f, Image: "" })); }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow">
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Arrastra o haz clic para subir</p>
                          <p className="text-xs text-gray-400 mt-1">Se recomienda usar URL para imágenes grandes</p>
                        </>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => handleImageFile(e.target.files[0])} />
                  </div>

                  {formMsg.text && (
                    <div className={`flex items-start gap-2 p-4 rounded-xl text-sm border ${
                      formMsg.type === "success"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {formMsg.type === "success"
                        ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                      <span>{formMsg.text}</span>
                    </div>
                  )}

                  <button type="submit" disabled={loadingForm}
                    className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                    {loadingForm
                      ? <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
                      : <><Save className="w-5 h-5" /> Guardar producto</>}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}