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
            Rescatamos la tradición milenaria de los Andes a través de instrumentos acústicos de alta calidad: zampoñas, quenas, toyos y tarkas elaboradas por maestros artesanos.
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
              visualizador 3D
            </button>
          </div>
        </div>

        {/* Reproductor de YouTube configurado correctamente con tu enlace */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-amber-800/30 bg-stone-950 aspect-video">
          <iframe
            className="w-full h-full object-cover"
            src="https://www.youtube.com/embed/P_1pm1osF3U?start=63" 
            title="Comercial Kallpa - Instrumentos Andinos"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}