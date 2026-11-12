import React from 'react';

export default function Home({ setCurrentPage }) {
  return (
    <div className="bg-[#17130f] text-amber-50 min-h-[calc(100vh-73px)] flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-amber-800/50 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-700/40">
            Instrumentos de Viento Andinos
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mt-4 mb-6 leading-tight text-amber-100">
            Comercial <span className="text-amber-500">Kallpa</span>
          </h1>
          <p className="text-amber-200/80 text-lg mb-8 leading-relaxed">
            Rescatamos la tradición milenaria de los Andes a través de instrumentos acústicos de alta calidad: zampoñas, quenas, toyos y tarkas elaborados por maestros artesanos.
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={() => setCurrentPage('catalog')}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition cursor-pointer">
              Ver Catálogo
            </button>
            <button 
              onClick={() => setCurrentPage('showroom')}
              className="border border-amber-600/60 hover:bg-amber-900/30 text-amber-200 font-medium px-6 py-3 rounded-xl transition cursor-pointer">
              Showroom 3D
            </button>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="w-full h-80 md:h-96 rounded-2xl bg-gradient-to-br from-amber-900/40 to-stone-900 border border-amber-800/30 shadow-2xl flex items-center justify-center p-6 text-center">
            <span className="text-amber-400 text-xl font-medium">🪈 [ Espacio para Visor / Imagen Destacada ]</span>
          </div>
        </div>
      </div>
    </div>
  );
}