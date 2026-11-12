import React from 'react';

export default function Navbar({ setCurrentPage }) {
  return (
    <nav className="bg-[#241b14] text-amber-100 px-6 py-4 flex justify-between items-center shadow-md border-b border-amber-900/40">
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-bold tracking-wide text-amber-400">🪈 Comercial Kallpa</span>
      </div>
      <div className="space-x-6 text-sm md:text-base">
        <button onClick={() => setCurrentPage('home')} className="hover:text-amber-400 transition cursor-pointer">Inicio</button>
        <button onClick={() => setCurrentPage('catalog')} className="hover:text-amber-400 transition cursor-pointer">Catálogo</button>
        <button onClick={() => setCurrentPage('showroom')} className="hover:text-amber-400 transition cursor-pointer">Showroom 3D</button>
        <button onClick={() => setCurrentPage('admin')} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition cursor-pointer shadow">Admin</button>
      </div>
    </nav>
  );
}