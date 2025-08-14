import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Galerie from '../components/Galerie';
import Footer from '../components/Footer';

const GaleriePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'accueil':
        navigate('/');
        break;
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
      case 'galerie':
        navigate('/galerie');
        break;
      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>
        <Galerie onNavigate={handleNavigate} />
      </main>
      <Footer />
    </div>
  );
};

export default GaleriePage;
