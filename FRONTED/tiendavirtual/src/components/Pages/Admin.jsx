import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard, Package, PlusCircle, LogOut,
  Trash2, Save, X, Upload, ShoppingBag,
  Users, ClipboardList, ImagePlus, CheckCircle,
  AlertCircle, Loader2, TrendingUp
} from "lucide-react";

const API = "http://localhost:8081/api";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]           = useState("dashboard");
  const [usuario, setUsuario]               = useState(null);
  const [productos, setProductos]           = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [usuarios, setUsuarios]             = useState([]);
  const [form, setForm]                     = useState({ Nombre: "", Descripcion: "", Precio: "", Image: "" });
  const [imagenPreview, setImagenPreview]   = useState(null);
  const [loadingForm, setLoadingForm]       = useState(false);
  const [formMsg, setFormMsg]               = useState({ type: "", text: "" });
  const fileRef = useRef();

  // ── Auth Guard ──────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (!stored) { navigate("/login"); return; }
    const u = JSON.parse(stored);
    if (u.rol !== "admin") { navigate("/"); return; }
    setUsuario(u);
  }, []);

  useEffect(() => { fetchProductos(); fetchUsuarios(); }, []);

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
      const { data } = await axios.get(`${API}/users`);
      setUsuarios(data.data || []);
    } catch { /* silent */ }
  }

  // ── Compresión de imagen ────────────────────────────────────
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
          setFormMsg({ type: "error", text: `Imagen muy grande (${kb} KB). Usa una URL https:// en lugar de subir el archivo.` });
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
      const msg = err.response?.data?.message || err.response?.data?.detalle || err.message || "Error desconocido.";
      setFormMsg({ type: "error", text: msg });
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

  const stats = [
    { label: "Productos", value: productos.length, sub: "En catálogo",      icon: <Package className="w-7 h-7" />,      color: "from-blue-500 to-blue-700" },
    { label: "Pedidos",   value: 0,                sub: "Total registrados", icon: <ClipboardList className="w-7 h-7" />, color: "from-emerald-500 to-emerald-700" },
    { label: "Usuarios",  value: usuarios.length,  sub: "Registrados",       icon: <Users className="w-7 h-7" />,        color: "from-violet-500 to-violet-700" },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard",                       icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "productos", label: `Productos (${productos.length})`, icon: <Package className="w-4 h-4" /> },
    { id: "agregar",   label: "Agregar producto",                icon: <PlusCircle className="w-4 h-4" /> },
  ];

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
          <div className="flex border-b border-gray-100">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
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
                <p className="text-gray-400 text-sm mb-6">Gestiona productos desde las pestañas de arriba.</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setActiveTab("productos")} className="px-5 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition">
                    Ver productos
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
                    <button onClick={() => setActiveTab("agregar")} className="mt-3 text-violet-600 text-sm font-semibold hover:underline">
                      Agregar el primero →
                    </button>
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