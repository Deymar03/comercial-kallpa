import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { products as fallbackProducts } from '../data/products';

export default function ProductCatalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      // Si la base de datos está vacía o sin conexión, usa los datos locales de respaldo
      setItems(data.length > 0 ? data : fallbackProducts);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-amber-200">Cargando catálogo...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-amber-100 mb-2">Catálogo de Instrumentos</h2>
      <p className="text-amber-200/70 mb-8">Explora nuestra colección seleccionada de instrumentos tradicionales.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((prod) => (
          <div key={prod.id} className="bg-stone-900/80 border border-amber-900/40 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="h-48 bg-amber-950/30 flex items-center justify-center text-amber-500/40 font-semibold">
              {prod.image_url || prod.image ? 'Imagen' : 'Sin imagen'}
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <span className="text-xs text-amber-500 uppercase font-semibold">{prod.instrument_type || prod.category}</span>
                <h3 className="text-lg font-bold text-amber-100 mt-1">{prod.name}</h3>
                <p className="text-sm text-stone-400 mt-2 line-clamp-2">{prod.description || 'Instrumento artesanal de excelente calidad y afinación profesional.'}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-amber-400 font-bold text-lg">bs{prod.price}</span>
                <button className="bg-amber-700 hover:bg-amber-600 text-white text-sm px-3 py-1.5 rounded-lg transition cursor-pointer">
                  Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}