import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductCatalog from './components/ProductCatalog';
import Showroom3D from './components/Showroom3D';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-[#17130f] text-stone-100 flex flex-col justify-between">
      <Navbar setCurrentPage={setCurrentPage} />

      <main className="flex-grow">
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'catalog' && <ProductCatalog />}
        {currentPage === 'showroom' && <Showroom3D />}
        {currentPage === 'admin' && <Admin />}
      </main>

      <Footer />
    </div>
  );
}