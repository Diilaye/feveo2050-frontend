import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProgramSection from '../components/ProgramSection';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    // Conversion des anciennes pages vers les nouvelles routes
    switch (page) {
      case 'admin-login':
        navigate('/admin/login');
        break;
      case 'admin-dashboard':
        navigate('/admin/dashboard');
        break;
      case 'wallet-login':
        navigate('/wallet/login');
        break;
      case 'wallet-dashboard':
        navigate('/wallet/dashboard');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'investir':
        navigate('/investir');
        break;
      case 'adhesion':
        navigate('/adhesion');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'home':
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onNavigate={handleNavigate} />
      <main>
        <HeroSection onNavigate={handleNavigate} />
        <ProgramSection />
        {/* <InvestmentSection /> */}
        {/* <AdhesionSection /> */}
        {/* <GallerySection /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
