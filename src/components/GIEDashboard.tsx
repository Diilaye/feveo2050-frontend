import React, { useState, useEffect } from 'react';
import { 
  User, 
  Wallet, 
  Package, 
  Users, 
  Activity, 
  LogOut,
  ArrowLeft,
  TrendingUp,
  Settings,
  CreditCard,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { useGIE } from '../hooks/useGIE';

const GIEDashboard = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const { gies, currentGIE, refreshGIEs, isLoading, error } = useGIE();
  const [activeTab, setActiveTab] = useState('wallet');

  // États pour les données du dashboard
  const [walletData, setWalletData] = useState({
    solde: 2450000,
    partsInvesties: 245,
    rendement: 12.5,
    derniereTransaction: '2024-03-15',
    transactions: [
      {
        id: 1,
        description: 'Vente produits agricoles',
        date: '2024-03-15',
        montant: 150000,
        type: 'Crédit'
      },
      {
        id: 2,
        description: 'Achat semences',
        date: '2024-03-10',
        montant: 50000,
        type: 'Débit'
      },
      {
        id: 3,
        description: 'Rendement investissement',
        date: '2024-03-05',
        montant: 200000,
        type: 'Crédit'
      }
    ]
  });

  const gieData = {
    nom: 'FEVEO-01-01-01-01-001',
    president: 'Fatou Diop',
    poste: 'Présidente'
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshGIEs();
    }
  }, [isAuthenticated, user]);

  // Rediriger si pas authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center mb-4">Accès restreint</h2>
          <p className="text-neutral-600 text-center mb-6">
            Vous devez être connecté pour accéder au tableau de bord GIE.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dashboard GIE</h1>
              <p className="text-sm text-gray-600">{gieData.nom}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{gieData.president}</p>
              <p className="text-xs text-gray-500">{gieData.poste}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-screen shadow-sm">
          {/* Navigation Menu */}
          <nav className="p-4">
            <button
              onClick={() => setActiveTab('wallet')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 bg-orange-500 text-white"
            >
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Wallet GIE</span>
            </button>

            {[
              { id: 'products', name: 'Produits', icon: Package },
              { id: 'activities', name: 'Activités', icon: Activity },
              { id: 'members', name: 'Membres', icon: Users },
              { id: 'settings', name: 'Paramètres', icon: Settings }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Title Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet GIE</h2>
            <p className="text-sm text-gray-600">Dernière mise à jour: 2024-03-15</p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Solde Total */}
            <div className="bg-blue-900 text-white p-6 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm">Solde Total</p>
                <CreditCard className="w-6 h-6 text-blue-200" />
              </div>
              <p className="text-3xl font-bold mb-1">2450000 FCFA</p>
            </div>

            {/* Parts Investies */}
            <div className="bg-green-500 text-white p-6 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-sm">Parts Investies</p>
                <BarChart3 className="w-6 h-6 text-green-200" />
              </div>
              <p className="text-3xl font-bold mb-1">245</p>
            </div>

            {/* Rendement */}
            <div className="bg-orange-500 text-white p-6 rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <p className="text-orange-100 text-sm">Rendement</p>
                <TrendingUp className="w-6 h-6 text-orange-200" />
              </div>
              <p className="text-3xl font-bold mb-1">12.5%</p>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Dernières Transactions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Vente produits agricoles</p>
                    <p className="text-sm text-gray-500">2024-03-15</p>
                  </div>
                  <div className="font-bold text-lg text-green-600">
                    +150000 FCFA
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Achat semences</p>
                    <p className="text-sm text-gray-500">2024-03-10</p>
                  </div>
                  <div className="font-bold text-lg text-red-600">
                    -50000 FCFA
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Rendement investissement</p>
                    <p className="text-sm text-gray-500">2024-03-05</p>
                  </div>
                  <div className="font-bold text-lg text-green-600">
                    +200000 FCFA
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GIEDashboard;
