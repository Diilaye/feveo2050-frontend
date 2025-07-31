import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import WalletLogin from '../components/WalletLogin';
import WalletDashboard from '../components/WalletDashboard';
import GIEDashboard from '../components/GIEDashboard';
import Investir from '../Investir';
import Adhesion from '../Adhesion';
import About from '../About';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route d'accueil */}
      <Route path="/" element={<Home />} />
      
      {/* Routes d'administration */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      {/* Routes du wallet */}
      <Route path="/wallet/login" element={<WalletLogin />} />
      <Route path="/wallet/dashboard" element={<WalletDashboard />} />
      
      {/* Autres routes */}
      <Route path="/dashboard" element={<GIEDashboard />} />
      <Route path="/investir" element={<Investir />} />
      <Route path="/adhesion" element={<Adhesion />} />
      <Route path="/about" element={<About />} />
      
      {/* Route 404 - redirection vers l'accueil */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
