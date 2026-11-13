import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, PlusCircle, Trash2, CheckCircle, RefreshCw, Plus } from 'lucide-react';
import { supabase } from '../services/api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);

  // Estado para el modal o input rápido de sumar stock a un producto específico
  const [restockModalProduct, setRestockModalProduct] = useState(null);
  const [addQuantity, setAddQuantity] = useState('');

  // Formulario de nuevo producto
  const [newProduct, setNewProduct] = useState({
    name: '',
    instrument_type: 'Zampoñas',
    construction: '',
    price: '',
    stock: '',
    image_url: ''
  });

  // 1. Cargar productos desde Supabase
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) console.error("Error al cargar productos:", error);
      else setProducts(data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // 2. Cargar ventas desde Supabase
  const fetchSales = async () => {
    setLoadingSales(true);
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('id', { ascending: false });

      if (error) console.error("Error al cargar ventas:", error);
      else setSales(data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoadingSales(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  // Registrar un nuevo instrumento
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          instrument_type: newProduct.instrument_type,
          construction: newProduct.construction || 'Madera / Artesanal',
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          image_url: newProduct.image_url || ''
        }]);

      if (error) {
        alert("Error al registrar producto: " + error.message);
        return;
      }

      alert("¡Instrumento registrado con éxito en Supabase!");
      setNewProduct({ name: '', instrument_type: 'Zampoñas', construction: '', price: '', stock: '', image_url: '' });
      fetchProducts();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  // Sumar stock directamente a un producto existente
  const handleConfirmRestock = async (e) => {
    e.preventDefault();
    if (!restockModalProduct || !addQuantity) return;

    const qtyToAdd = parseInt(addQuantity);
    if (isNaN(qtyToAdd) || qtyToAdd <= 0) return;

    const newTotalStock = restockModalProduct.stock + qtyToAdd;

    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newTotalStock })
        .eq('id', restockModalProduct.id);

      if (error) {
        alert("Error al actualizar stock: " + error.message);
        return;
      }

      alert(`¡Stock actualizado! Se sumaron ${qtyToAdd} unidades a ${restockModalProduct.name}.`);
      setRestockModalProduct(null);
      setAddQuantity('');
      fetchProducts();
    } catch (err) {
      console.error("Error al actualizar stock:", err);
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        alert("No se pudo eliminar: " + error.message);
        return;
      }
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  // Cambiar estado de venta
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'En Proceso' ? 'Completado' : 'En Proceso';

    try {
      const { error } = await supabase
        .from('sales')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        alert("Error al actualizar estado: " + error.message);
        return;
      }

      setSales(sales.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-amber-900/40 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-amber-100 mb-2">Panel de Administración</h2>
          <p className="text-amber-200/70 text-sm">Gestión de inventario y control de ventas sincronizado con Supabase.</p>
        </div>
        
        {/* Pestañas de Navegación Principales */}
        <div className="flex gap-2 bg-stone-900 p-1.5 rounded-xl border border-amber-950">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'products' ? 'bg-amber-700 text-white shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> Inventario
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sales' ? 'bg-amber-700 text-white shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> Ventas y Pedidos ({sales.length})
          </button>
        </div>
      </div>

      {/* SECCIÓN 1: INVENTARIO */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario para Nuevo Producto */}
          <div className="bg-stone-900/80 border border-amber-900/40 rounded-2xl p-6 shadow-xl h-fit">
            <h3 className="text-lg font-bold text-amber-200 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-500" /> Registrar Nuevo Instrumento
            </h3>
            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Nombre y Variante</label>
                <input 
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Ej. Quena de Ébano"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Categoría</label>
                <select 
                  value={newProduct.instrument_type}
                  onChange={(e) => setNewProduct({...newProduct, instrument_type: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
                >
                  <option value="Zampoñas">Zampoñas</option>
                  <option value="Bajos">Bajos (Toyos)</option>
                  <option value="Quenas">Quenas</option>
                  <option value="Quenachos">Quenachos</option>
                  <option value="Tarkas">Tarkas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Construcción</label>
                <input 
                  type="text"
                  value={newProduct.construction}
                  onChange={(e) => setNewProduct({...newProduct, construction: e.target.value})}
                  placeholder="Ej. Madera seleccionada"
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Precio (Bs.)</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="100"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Stock Inicial</label>
                  <input 
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    placeholder="10"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 font-bold text-white rounded-xl shadow-lg transition cursor-pointer mt-2 text-sm"
              >
                Guardar en Supabase
              </button>
            </form>
          </div>

          {/* Tabla de Inventario con Botón Rápido para Sumar Stock */}
          <div className="lg:col-span-2 bg-stone-900/80 border border-amber-900/40 rounded-2xl p-6 shadow-xl overflow-x-auto">
            <h3 className="text-lg font-bold text-amber-200 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" /> Inventario Actual en Supabase
            </h3>

            {loadingProducts ? (
              <p className="text-amber-200 text-center py-8">Cargando productos...</p>
            ) : products.length === 0 ? (
              <p className="text-stone-400 text-center py-8">No hay instrumentos registrados en la base de datos.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 text-amber-300 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Instrumento</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Precio</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-sm">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-800/50 transition">
                      <td className="py-3 px-4 font-medium text-stone-100">{item.name}</td>
                      <td className="py-3 px-4 text-stone-400">{item.instrument_type}</td>
                      <td className="py-3 px-4 text-amber-400 font-semibold">Bs.{item.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          item.stock > 5 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {item.stock} unids.
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center flex items-center justify-center gap-2">
                        {/* Botón rápido para sumar stock sin salir de la vista */}
                        <button 
                          onClick={() => { setRestockModalProduct(item); setAddQuantity(''); }}
                          className="px-2.5 py-1 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Sumar stock"
                        >
                          <Plus className="w-3.5 h-3.5" /> Stock
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-1.5 bg-rose-900/40 text-rose-300 hover:bg-rose-900 rounded-lg transition cursor-pointer"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}

      {/* SECCIÓN 2: VENTAS */}
      {activeTab === 'sales' && (
        <div className="bg-stone-900/80 border border-amber-900/40 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-amber-200 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-500" /> Control de Ventas y Transacciones (Supabase)
            </h3>
            <span className="text-xs text-stone-400 bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
              Total Registradas: <strong className="text-amber-400">{sales.length}</strong>
            </span>
          </div>

          {loadingSales ? (
            <p className="text-amber-200 text-center py-8">Consultando transacciones en Supabase...</p>
          ) : sales.length === 0 ? (
            <p className="text-stone-400 text-center py-8">No hay ventas registradas en la base de datos todavía.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 text-amber-300 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Pedido ID</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Instrumento / Lote</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-center">Estado del Pedido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 text-sm">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-stone-800/50 transition">
                    <td className="py-3 px-4 text-amber-400 font-mono">#{sale.id}</td>
                    <td className="py-3 px-4 font-medium text-stone-100">{sale.client}</td>
                    <td className="py-3 px-4 text-stone-300">{sale.item}</td>
                    <td className="py-3 px-4 text-amber-400 font-semibold">{sale.total} Bs.</td>
<td className="py-3 px-4 text-stone-400 text-xs">
  {sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() + ' ' + new Date(sale.sale_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Sin fecha'}
</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(sale.id, sale.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          sale.status === 'Completado' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900' 
                            : 'bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900'
                        }`}
                      >
                        {sale.status === 'Completado' ? <CheckCircle className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        {sale.status} (Cambiar)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* MODAL RÁPIDO PARA SUMAR STOCK (Integrado en la misma vista) */}
      {restockModalProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-amber-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-stone-200">
            <button 
              onClick={() => setRestockModalProduct(null)}
              className="absolute top-3 right-3 text-stone-400 hover:text-white text-lg font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-amber-100 mb-1">Incrementar Stock</h3>
            <p className="text-xs text-amber-300/80 mb-4">{restockModalProduct.name}</p>
            <p className="text-xs text-stone-400 mb-4">Stock actual: <strong className="text-stone-200">{restockModalProduct.stock} unidades</strong></p>

            <form onSubmit={handleConfirmRestock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Cantidad a Sumar (+)</label>
                <input 
                  type="number"
                  min="1"
                  required
                  autoFocus
                  value={addQuantity}
                  onChange={(e) => setAddQuantity(e.target.value)}
                  placeholder="Ej. 10"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button 
                  type="button"
                  onClick={() => setRestockModalProduct(null)}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
                >
                  Guardar Incremento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}