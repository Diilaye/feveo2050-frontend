import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProgramSection from './components/ProgramSection';
import InvestmentSection from './components/InvestmentSection';
import AdhesionSection from './components/AdhesionSection';
import GallerySection from './components/GallerySection';
import Footer from './components/Footer';
import GIEDashboard from './components/GIEDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'dashboard') {
    return <GIEDashboard />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onNavigate={setCurrentPage} />
      <main>
        <HeroSection />
        <ProgramSection />
        <InvestmentSection />
        <AdhesionSection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
}

export default App;