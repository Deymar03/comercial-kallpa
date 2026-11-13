import React, { useEffect, useState } from 'react';
import { getProducts, supabase } from '../services/api';

export default function ProductCatalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [clientName, setClientName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      setItems(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleOpenDetails = (prod) => {
    setSelectedProduct(prod);
    setClientName('');
    setQuantity(1);
    setOrderSuccess(false);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setClientName('');
    setQuantity(1);
    setOrderSuccess(false);
  };


// Función para registrar el pedido de forma limpia y ordenada en Supabase
const handleMakeOrder = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || quantity < 1) return;

    setIsOrdering(true);
    const unitPrice = selectedProduct.price; // Asumiendo que tu precio está en Bs. o ajustado
    const totalPrice = unitPrice * quantity;
    const itemDescription = `${selectedProduct.name} (${quantity} unidades)`;

    try {
      // 1. Insertar la venta principal en la tabla 'sales'
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([
          { 
            client: clientName.trim(), 
            item: itemDescription, 
            total: totalPrice, 
            status: 'En Proceso', 
            sale_date: new Date().toISOString() 
          }
        ])
        .select()
        .single();

      if (saleError) throw saleError;

      // 2. Insertar el detalle relacional en la tabla 'sale_details'
      const newSaleId = saleData.id;
      const { error: detailError } = await supabase
        .from('sale_details')
        .insert([
          {
            sale_id: newSaleId,
            product_id: selectedProduct.id,
            quantity: quantity,
            unit_price: unitPrice,
            subtotal: totalPrice
          }
        ]);

      if (detailError) throw detailError;

      // 3. (Opcional) Descontar el stock del producto en la tabla 'products'
      const newStock = Math.max(0, selectedProduct.stock - quantity);
      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', selectedProduct.id);

      setOrderSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 2500);

    } catch (err) {
      console.error("Error al procesar pedido en Supabase:", err.message);
      alert("Error al procesar: " + err.message);
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-amber-200">Cargando catálogo detallado...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 relative">
      <h2 className="text-3xl font-bold text-amber-100 mb-2">Catálogo de Instrumentos Andinos</h2>
      <p className="text-amber-200/70 mb-8">Sincronizado con Supabase - Comercial Kallpa.</p>

      {items.length === 0 ? (
        <p className="text-amber-300 text-center py-10">No se encontraron productos registrados en Supabase.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((prod) => (
            <div key={prod.id} className="bg-stone-900/80 border border-amber-900/40 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
              <div className="h-48 bg-amber-950/30 flex items-center justify-center text-amber-500/40">
                {prod.image_url ? (
                  <img src={prod.image_url} alt={prod.name} className="h-full w-full object-cover" />
                ) : (
                  'Sin imagen'
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-xs text-amber-500 uppercase font-semibold">{prod.instrument_type}</span>
                  <h3 className="text-lg font-bold text-amber-100 mt-1">{prod.name}</h3>
                  <p className="text-xs text-stone-400 mt-2 line-clamp-2">Especificación: {prod.construction}</p>
                  <p className="text-xs text-stone-500 mt-1">Stock: {prod.stock}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-lg">Bs.{prod.price}</span>
                  <button 
                    onClick={() => handleOpenDetails(prod)}
                    className="bg-amber-700 hover:bg-amber-600 text-white text-sm px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Detalles / Pedir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-amber-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-stone-200">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="text-xs bg-amber-900/50 text-amber-400 px-2.5 py-1 rounded-full uppercase font-semibold">
              {selectedProduct.instrument_type}
            </span>

            <h3 className="text-2xl font-bold text-amber-100 mt-3">{selectedProduct.name}</h3>
            
            <div className="my-3 h-40 bg-stone-950 rounded-lg overflow-hidden flex items-center justify-center border border-amber-950">
              {selectedProduct.image_url ? (
                <img src={selectedProduct.image_url} alt={selectedProduct.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-stone-600">Sin imagen disponible</span>
              )}
            </div>

            <div className="space-y-1.5 text-sm text-stone-300 mb-4">
              <p><strong className="text-amber-300">Construcción:</strong> {selectedProduct.construction}</p>
              <p><strong className="text-amber-300">Precio Unitario:</strong> <span className="text-amber-400 font-bold">Bs.{selectedProduct.price}</span></p>
            </div>

            {orderSuccess ? (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-center text-sm font-bold">
                ¡Pedido institucional registrado con éxito en Supabase!
              </div>
            ) : (
              <form onSubmit={handleMakeOrder} className="space-y-3 border-t border-amber-900/40 pt-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    Nombre del Cliente / Representante del Conjunto:
                  </label>
                  <input 
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Carlos Gamboa"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      Cantidad (Unidades / Lotes):
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max={selectedProduct.stock}
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 focus:border-amber-600 focus:outline-none"
                    />
                  </div>
                  <div className="text-right pt-4">
                    <span className="text-xs text-stone-400 block">Total a pagar:</span>
                    <span className="text-lg font-extrabold text-amber-400">
                      Bs.{selectedProduct.price * quantity}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isOrdering}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition cursor-pointer disabled:opacity-50"
                  >
                    {isOrdering ? 'Procesando...' : 'Confirmar Pedido Múltiple'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}