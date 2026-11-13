import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';

export default function ProductCatalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
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
                  <span className="text-amber-400 font-bold text-lg">${prod.price}</span>
                  <button 
                    onClick={() => handleOpenDetails(prod)}
                    className="bg-amber-700 hover:bg-amber-600 text-white text-sm px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE DETALLES TÉCNICOS */}
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
            
            <div className="my-4 h-56 bg-stone-950 rounded-lg overflow-hidden flex items-center justify-center border border-amber-950">
              {selectedProduct.image_url ? (
                <img src={selectedProduct.image_url} alt={selectedProduct.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-stone-600">Sin imagen disponible</span>
              )}
            </div>

            <div className="space-y-3 text-sm text-stone-300">
              <p><strong className="text-amber-300">Detalle de Construcción / Material:</strong> <br/>{selectedProduct.construction}</p>
              <p><strong className="text-amber-300">Precio unitario:</strong> <span className="text-amber-400 text-lg font-bold">${selectedProduct.price}</span></p>
              <p><strong className="text-amber-300">Existencias disponibles:</strong> {selectedProduct.stock} unidades</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleCloseModal}
                className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}