import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProgramSection from './components/ProgramSection';
import InvestmentSection from './components/InvestmentSection';
import AdhesionSection from './components/AdhesionSection';
import GallerySection from './components/GallerySection';
import Footer from './components/Footer';
import GIEDashboard from './components/GIEDashboard';
import Investir from './Investir';
import Adhesion from './Adhesion';
import About from './About';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'dashboard') {
    return <GIEDashboard />;
  }
  if (currentPage === 'investir') {
    return <Investir  />;
  }
  if (currentPage === 'adhesion') {
    return <Adhesion onNavigate={setCurrentPage} />;
  }
  if (currentPage === 'about') {
    return <About onBack={() => setCurrentPage('home')} onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onNavigate={setCurrentPage} />
      <main>
        <HeroSection onNavigate={setCurrentPage} />
        <ProgramSection />
        {/* <InvestmentSection /> */}
        {/* <AdhesionSection /> */}
        {/* <GallerySection /> */}
      </main>
      <Footer />
    </div>
  );
}

export default App;