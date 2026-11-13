import React from 'react';
import { Play, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Columna de Texto Principal */}
      <div className="space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/50 text-amber-300 text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-amber-400" /> Instrumentos de Viento Andinos
        </span>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-100 tracking-tight leading-tight">
          Comercial Kallpa
        </h1>
        
        <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
          Rescatamos la tradición milenaria de los Andes a través de instrumentos acústicos de alta calidad: zampoñas, quenas, toyo y tarkas elaboradas por maestros artesanos.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <a 
            href="#catalogo" 
            className="px-6 py-3.5 rounded-xl font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            Ver Catálogo
          </a>
          <a 
            href="#showroom" 
            className="px-6 py-3.5 rounded-xl font-bold text-amber-200 bg-stone-900 border border-amber-900/60 hover:bg-stone-800 transition cursor-pointer"
          >
            Sala de exposición 3D
          </a>
        </div>
      </div>

      {/* Columna del Visor: Video de YouTube Incrustado */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-amber-900/50 bg-stone-950 aspect-video">
        <iframe
          className="w-full h-full object-cover"
          src="https://www.youtube.com/embed/Zf5muMnhPeY?autoplay=0&mute=1&loop=1" 
          title="Comercial Kallpa - Instrumentos Andinos"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

    </div>
  );
}